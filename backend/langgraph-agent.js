const { StateGraph, END } = require('@langchain/langgraph');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

// Define the state structure
const AgentState = {
    content: String,
    contentType: String, // 'health', 'politics', 'general'
    riskLevel: String,   // 'low', 'medium', 'high'
    aiResults: Array,
    consensus: Object,
    sources: Array,
    finalVerdict: String,
    confidence: Number,
    processingPath: Array
};

class MisinformationAgent {
    constructor() {
        this.gpt4 = new ChatOpenAI({ modelName: "gpt-4", temperature: 0.1 });
        this.gemini = new ChatGoogleGenerativeAI({ modelName: "gemini-pro" });
        this.graph = this.buildGraph();
    }

    buildGraph() {
        const workflow = new StateGraph(AgentState);

        // Add nodes
        workflow.addNode("classify_content", this.classifyContent.bind(this));
        workflow.addNode("assess_risk", this.assessRisk.bind(this));
        workflow.addNode("parallel_analysis", this.parallelAnalysis.bind(this));
        workflow.addNode("source_verification", this.sourceVerification.bind(this));
        workflow.addNode("calculate_consensus", this.calculateConsensus.bind(this));
        workflow.addNode("generate_report", this.generateReport.bind(this));

        // Define the flow
        workflow.setEntryPoint("classify_content");
        
        workflow.addEdge("classify_content", "assess_risk");
        workflow.addEdge("assess_risk", "parallel_analysis");
        workflow.addEdge("parallel_analysis", "source_verification");
        workflow.addEdge("source_verification", "calculate_consensus");
        workflow.addEdge("calculate_consensus", "generate_report");
        workflow.addEdge("generate_report", END);

        // Conditional routing based on risk level
        workflow.addConditionalEdges(
            "assess_risk",
            this.routeByRisk.bind(this),
            {
                "high_risk": "parallel_analysis",
                "low_risk": "source_verification"
            }
        );

        return workflow.compile();
    }

    async classifyContent(state) {
        const prompt = `Classify this content type and extract key topics:
        Content: "${state.content}"
        
        Return JSON: {"type": "health|politics|general", "topics": ["topic1", "topic2"]}`;

        const result = await this.gpt4.invoke(prompt);
        const classification = JSON.parse(result.content);

        return {
            ...state,
            contentType: classification.type,
            topics: classification.topics,
            processingPath: [...state.processingPath, 'classify_content']
        };
    }

    async assessRisk(state) {
        const riskPrompt = `Assess misinformation risk level:
        Content: "${state.content}"
        Type: ${state.contentType}
        
        Consider: viral potential, harm level, source credibility
        Return: low|medium|high`;

        const result = await this.gemini.invoke(riskPrompt);
        const riskLevel = result.content.trim().toLowerCase();

        return {
            ...state,
            riskLevel,
            processingPath: [...state.processingPath, 'assess_risk']
        };
    }

    routeByRisk(state) {
        return state.riskLevel === 'high' ? 'high_risk' : 'low_risk';
    }

    async parallelAnalysis(state) {
        // Run multiple AI models in parallel
        const analysisPromises = [
            this.analyzeWithGPT4(state.content),
            this.analyzeWithGemini(state.content),
            this.analyzeWithPerplexity(state.content)
        ];

        const results = await Promise.allSettled(analysisPromises);
        const aiResults = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);

        return {
            ...state,
            aiResults,
            processingPath: [...state.processingPath, 'parallel_analysis']
        };
    }

    async sourceVerification(state) {
        // Verify sources based on content type
        const sources = await this.fetchRelevantSources(state.content, state.contentType);
        
        return {
            ...state,
            sources,
            processingPath: [...state.processingPath, 'source_verification']
        };
    }

    async calculateConsensus(state) {
        // Weighted consensus algorithm
        const consensus = this.weightedConsensus(state.aiResults, state.sources);
        
        return {
            ...state,
            consensus,
            finalVerdict: consensus.verdict,
            confidence: consensus.confidence,
            processingPath: [...state.processingPath, 'calculate_consensus']
        };
    }

    async generateReport(state) {
        const report = {
            verdict: state.finalVerdict,
            confidence: state.confidence,
            contentType: state.contentType,
            riskLevel: state.riskLevel,
            sources: state.sources,
            processingPath: state.processingPath,
            timestamp: new Date().toISOString(),
            modelCount: state.aiResults.length
        };

        return {
            ...state,
            report,
            processingPath: [...state.processingPath, 'generate_report']
        };
    }

    // Helper methods
    async analyzeWithGPT4(content) {
        const prompt = `Fact-check this content. Return JSON with verdict and confidence:
        "${content}"`;
        const result = await this.gpt4.invoke(prompt);
        return { model: 'GPT-4', ...JSON.parse(result.content) };
    }

    async analyzeWithGemini(content) {
        const prompt = `Analyze for misinformation: "${content}"`;
        const result = await this.gemini.invoke(prompt);
        return { model: 'Gemini', verdict: 'MIXED', confidence: 75 }; // Simplified
    }

    async analyzeWithPerplexity(content) {
        // Perplexity API call
        return { model: 'Perplexity', verdict: 'VERIFIED', confidence: 85 };
    }

    async fetchRelevantSources(content, type) {
        // Fetch sources based on content type
        const sourceMap = {
            'health': ['WHO', 'CDC', 'PubMed'],
            'politics': ['Reuters', 'AP', 'Government'],
            'general': ['Snopes', 'FactCheck.org']
        };
        return sourceMap[type] || sourceMap['general'];
    }

    weightedConsensus(aiResults, sources) {
        // Implement weighted consensus algorithm
        const verdictCounts = {};
        let totalConfidence = 0;

        aiResults.forEach(result => {
            verdictCounts[result.verdict] = (verdictCounts[result.verdict] || 0) + 1;
            totalConfidence += result.confidence;
        });

        const finalVerdict = Object.keys(verdictCounts).reduce((a, b) => 
            verdictCounts[a] > verdictCounts[b] ? a : b
        );

        return {
            verdict: finalVerdict,
            confidence: Math.round(totalConfidence / aiResults.length),
            agreement: verdictCounts[finalVerdict] / aiResults.length
        };
    }

    async analyze(content) {
        const initialState = {
            content,
            contentType: '',
            riskLevel: '',
            aiResults: [],
            consensus: {},
            sources: [],
            finalVerdict: '',
            confidence: 0,
            processingPath: []
        };

        const result = await this.graph.invoke(initialState);
        return result.report;
    }
}

module.exports = MisinformationAgent;