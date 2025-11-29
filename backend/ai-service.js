const OpenAI = require('openai');
const winston = require('winston');

class AIService {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [new winston.transports.File({ filename: 'logs/ai-service.log' })]
        });
    }

    async analyzeContent(content, sources = []) {
        const startTime = Date.now();
        
        try {
            // Multi-AI consensus approach
            const [gptResult, geminiResult, perplexityResult] = await Promise.allSettled([
                this.analyzeWithGPT(content, sources),
                this.analyzeWithGemini(content, sources),
                this.analyzeWithPerplexity(content, sources)
            ]);

            const results = [gptResult, geminiResult, perplexityResult]
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            if (results.length === 0) {
                throw new Error('All AI services failed');
            }

            // Consensus algorithm
            const consensus = this.calculateConsensus(results);
            const processingTime = Date.now() - startTime;

            this.logger.info('Analysis completed', {
                contentLength: content.length,
                processingTime,
                consensus: consensus.verdict,
                confidence: consensus.confidence
            });

            return {
                ...consensus,
                processingTime,
                sources: this.aggregateSources(results),
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            this.logger.error('Analysis failed', { error: error.message, contentLength: content.length });
            throw error;
        }
    }

    async analyzeWithGPT(content, sources) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert fact-checker. Analyze content for misinformation and provide a verdict (TRUE/FALSE/MIXED/UNVERIFIABLE) with confidence score (0-100) and reasoning."
                },
                {
                    role: "user",
                    content: `Analyze this content: "${content}"\n\nAvailable sources: ${JSON.stringify(sources)}`
                }
            ],
            temperature: 0.1,
            max_tokens: 1000
        });

        return this.parseAIResponse(response.choices[0].message.content, 'GPT-4');
    }

    async analyzeWithGemini(content, sources) {
        // Gemini API integration
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Fact-check this content: "${content}". Sources: ${JSON.stringify(sources)}`
                    }]
                }]
            })
        });

        const data = await response.json();
        return this.parseAIResponse(data.candidates[0].content.parts[0].text, 'Gemini');
    }

    async analyzeWithPerplexity(content, sources) {
        // Perplexity API integration
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-large-128k-online',
                messages: [{
                    role: 'user',
                    content: `Fact-check with citations: "${content}"`
                }]
            })
        });

        const data = await response.json();
        return this.parseAIResponse(data.choices[0].message.content, 'Perplexity');
    }

    parseAIResponse(response, model) {
        // Parse AI response into structured format
        const verdictMatch = response.match(/(?:VERDICT|CLASSIFICATION):\s*(TRUE|FALSE|MIXED|UNVERIFIABLE)/i);
        const confidenceMatch = response.match(/(?:CONFIDENCE|SCORE):\s*(\d+(?:\.\d+)?)/i);
        
        return {
            model,
            verdict: verdictMatch ? verdictMatch[1].toUpperCase() : 'UNVERIFIABLE',
            confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 50,
            reasoning: response,
            timestamp: new Date().toISOString()
        };
    }

    calculateConsensus(results) {
        // Weighted consensus algorithm
        const verdictCounts = {};
        let totalConfidence = 0;
        let totalWeight = 0;

        results.forEach(result => {
            const weight = result.confidence / 100;
            verdictCounts[result.verdict] = (verdictCounts[result.verdict] || 0) + weight;
            totalConfidence += result.confidence * weight;
            totalWeight += weight;
        });

        const finalVerdict = Object.keys(verdictCounts).reduce((a, b) => 
            verdictCounts[a] > verdictCounts[b] ? a : b
        );

        return {
            verdict: finalVerdict,
            confidence: Math.round(totalConfidence / totalWeight),
            modelCount: results.length,
            agreement: verdictCounts[finalVerdict] / totalWeight
        };
    }

    aggregateSources(results) {
        const sources = new Set();
        results.forEach(result => {
            if (result.sources) {
                result.sources.forEach(source => sources.add(source));
            }
        });
        return Array.from(sources);
    }
}

module.exports = AIService;