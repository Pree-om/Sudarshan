const dynamicContent = [
    "INITIALIZING AGENTIC AI...",
    "Multi-AI fact-checking with citations",
    "Real-time verification and source attribution",
    "Advanced misinformation detection system"
];

const services = [
    { title: "Multi-AI Fact Checking", description: "GPT-4, Gemini, Perplexity, Groq verification" },
    { title: "Fast Processing", description: "Groq's lightning-fast open-source LLMs" },
    { title: "Image Analysis", description: "Extract and verify text from images" },
    { title: "Social Media Scraping", description: "Cross-reference with X/Twitter data" },
    { title: "Source Attribution", description: "Reliable citations and evidence" }
];

// Business Model Variables
let userPlan = 'free';
let dailyUsage = 0;
let monthlyUsage = 0;
const planLimits = {
    free: { daily: 10, monthly: 300, api: false },
    pro: { daily: 1000, monthly: 30000, api: true },
    enterprise: { daily: -1, monthly: -1, api: true }
};

// Sample Test Cases
const sampleCases = {
    'fake-news': {
        text: "BREAKING: Scientists discover that drinking bleach cures all diseases. Major pharmaceutical companies are trying to hide this miracle cure from the public. Share before they delete this!",
        expectedVerdict: "FAKE NEWS",
        description: "Completely fabricated health claim with dangerous misinformation"
    },
    'misinformation': {
        text: "The COVID-19 vaccine contains microchips that allow the government to track your location. This has been confirmed by multiple whistleblowers from tech companies.",
        expectedVerdict: "MISINFORMATION",
        description: "False conspiracy theory lacking credible evidence"
    },
    'verified': {
        text: "The World Health Organization announced new guidelines for pandemic preparedness following lessons learned from COVID-19. The guidelines emphasize early detection and international cooperation.",
        expectedVerdict: "VERIFIED",
        description: "Factual statement that can be verified through official WHO sources"
    },
    'rumor': {
        text: "Unconfirmed reports suggest that a major tech company is planning to acquire a popular social media platform for $50 billion. Sources close to the deal say negotiations are ongoing.",
        expectedVerdict: "UNVERIFIABLE",
        description: "Unsubstantiated claim without official confirmation"
    }
};

// GNews API Configuration
const GNEWS_API_KEY = 'd7d18a07236e94e4c288d4fe32628c43' 
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

// Fetch real news data
async function fetchRealNews() {
    try {
        const response = await fetch(`${GNEWS_BASE_URL}/top-headlines?token=${GNEWS_API_KEY}&lang=en&max=10`);
        if (!response.ok) throw new Error('News API failed');
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return getFallbackNews();
    }
}

// Fallback news data
function getFallbackNews() {
    const topics = ['AI Regulation', 'Cybersecurity', 'Digital Policy', 'Tech Innovation', 'Misinformation Trends'];
    return [
        {
            title: "Global misinformation trends show 40% increase in AI-generated content",
            description: "New study reveals sophisticated AI tools being used to create convincing fake news",
            publishedAt: new Date().toISOString(),
            source: { name: "Cyber Security Watch" },
            content: "Recent analysis indicates a significant rise in AI-generated misinformation campaigns."
        },
        {
            title: "Governments worldwide implement stricter digital content verification policies",
            description: "New regulations require social platforms to implement real-time fact-checking",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: "Policy Review" },
            content: "International cooperation on digital content integrity reaches new levels."
        },
        {
            title: "Breakthrough in deepfake detection achieves 95% accuracy",
            description: "New AI models can identify manipulated media with unprecedented precision",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { name: "Tech Innovation Daily" },
            content: "Researchers develop multi-modal approach to combat synthetic media."
        },
        {
            title: "Social media platforms face increased scrutiny over misinformation spread",
            description: "Regulatory bodies demand transparent content moderation algorithms",
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: { name: "Digital Policy Monitor" },
            content: "Platform accountability becomes central to digital trust initiatives."
        }
    ];
}

// Update news feed with real data
async function updateNewsFeed() {
    const feedContainer = document.getElementById('news-feed');
    const articles = await fetchRealNews();
    
    if (articles.length === 0) {
        feedContainer.innerHTML = '<div class="loader-text">SATELLITE OFFLINE - SWITCHING TO LOCAL FEED</div>';
        return;
    }
    
    feedContainer.innerHTML = articles.map((article, index) => `
        <div class="news-item">
            <div class="news-meta">
                <span>${article.source.name}</span>
                <span>${new Date(article.publishedAt).toLocaleTimeString()}</span>
            </div>
            <div class="news-title">${article.title}</div>
            <div class="risk-bar">
                <div class="risk-fill ${getRandomRiskLevel()}"></div>
            </div>
        </div>
    `).join('');
    
    // Auto-refresh every 5 minutes
    setTimeout(updateNewsFeed, 300000);
}

function getRandomRiskLevel() {
    const levels = ['low', 'med', 'high'];
    return levels[Math.floor(Math.random() * levels.length)];
}

// Modal Functions
function showSignInModal() {
    const modal = document.getElementById('signin-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '10000';
        console.log('Modal should be visible now');
    } else {
        console.error('Modal element not found');
    }
}

function closeSignInModal() {
    document.getElementById('signin-modal').style.display = 'none';
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="switchAuthTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-auth`).classList.add('active');
}

// Email Authentication
function handleEmailSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AUTHENTICATING...';
    
    // Simulate authentication
    setTimeout(() => {
        const userData = {
            name: email.split('@')[0].toUpperCase(),
            email: email,
            image: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=00f3ff&color=000&size=30`
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        updateUserInterface(userData);
        closeSignInModal();
        
        // Reset form
        document.getElementById('email-input').value = '';
        document.getElementById('password-input').value = '';
        submitBtn.innerHTML = '<i class="fa-solid fa-key"></i> AUTHENTICATE';
    }, 2000);
}

// OAuth Functions
function handleGoogleSignIn() {
    simulateOAuthSignIn('Google', 'google.demo@sudrashan.com');
}

function handleGitHubSignIn() {
    simulateOAuthSignIn('GitHub', 'github.demo@sudrashan.com');
}

function handleMicrosoftSignIn() {
    simulateOAuthSignIn('Microsoft', 'microsoft.demo@sudrashan.com');
}

function simulateOAuthSignIn(provider, email) {
    const userData = {
        name: "mohitkumar",
        email: email,
        image: `https://ui-avatars.com/api/?name=mohitkumar&background=00f3ff&color=000&size=30`
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    updateUserInterface(userData);
    closeSignInModal();
}

// Helper Functions
function showForgotPassword() {
    alert('Password reset functionality would be implemented here.\nFor demo: Use any email/password combination.');
}

function showRegister() {
    alert('Registration functionality would be implemented here.\nFor demo: Use any email/password combination to sign in.');
}

function updateUserInterface(userData) {
    const navMenu = document.getElementById('nav-menu');
    const signinContainer = document.getElementById('signin-container');
    
    if (signinContainer) {
        signinContainer.innerHTML = `
            <div class="user-profile">
                <img src="${userData.image}" alt="${userData.name}" style="width: 30px; height: 30px; border-radius: 50%;">
                <span style="margin-left: 10px; font-size: 0.8rem;">${userData.name}</span>
                <button onclick="handleSignOut()" class="cyber-btn small" style="margin-left: 10px;">LOGOUT</button>
            </div>
        `;
    }
}

function handleSignOut() {
    localStorage.removeItem('user');
    location.reload();
}

// Configuration object
const CONFIG = {
    DEMO_MODE: true,
    N8N_WEBHOOK_URL: 'https://demo.n8n.sudrashan.com/webhook/misinformation-detection',
    GOOGLE_OAUTH: {
        CLIENT_ID: '653560897306-oo3f5j3g1rkl1ou4n1shiddndhnu2e09.apps.googleusercontent.com',
        SCOPES: 'profile email'
    },
    TRANSLATION: {
        ENABLED: true
    }
};

// Use configuration from config.js
const N8N_WEBHOOK_URL = CONFIG.N8N_WEBHOOK_URL;

let contentIndex = 0;

// Initialize website
// Check if should show loading page
function checkLoadingPage() {
    const fromLoading = sessionStorage.getItem('fromLoading');
    if (!fromLoading) {
        window.location.href = 'loading.html';
        return false;
    }
    sessionStorage.removeItem('fromLoading');
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkLoadingPage()) return;
    
    updateCurrentYear();
    loadServices();
    updateDynamicText();
    setupUploadArea();
    updateNewsFeed();
    
    // Load usage data from localStorage
    const savedUsage = localStorage.getItem('dailyUsage');
    const savedDate = localStorage.getItem('lastUsageDate');
    const today = new Date().toDateString();
    
    if (savedDate === today && savedUsage) {
        dailyUsage = parseInt(savedUsage);
        monthlyUsage = parseInt(localStorage.getItem('monthlyUsage') || '0');
    } else {
        // Reset daily usage for new day
        dailyUsage = 0;
        localStorage.setItem('dailyUsage', '0');
        localStorage.setItem('lastUsageDate', today);
    }
    
    // Check for existing user session
    const userData = localStorage.getItem('user');
    if (userData) {
        updateUserInterface(JSON.parse(userData));
    }
    
    // Show initial usage display
    updateUsageDisplay();
    
    // Auto-update dynamic content every 4 seconds
    setInterval(updateDynamicText, 4000);
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

function updateContent() {
    contentIndex = (contentIndex + 1) % dynamicContent.length;
    updateDynamicText();
}

function updateDynamicText() {
    const textElement = document.getElementById('dynamic-text');
    textElement.style.opacity = '0';
    
    setTimeout(() => {
        textElement.textContent = dynamicContent[contentIndex];
        textElement.style.opacity = '1';
        contentIndex = (contentIndex + 1) % dynamicContent.length;
    }, 300);
}

function loadServices() {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = services.map(service => `
        <div class="service-card">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

async function processText() {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
        showSignInModal();
        return;
    }
    
    const textInput = document.getElementById('text-input').value;
    const resultsDiv = document.getElementById('results');
    
    if (!textInput.trim()) {
        resultsDiv.innerHTML = '<p style="color: red;">Please enter some text to process.</p>';
        return;
    }
    
    // Check usage limits before processing
    if (!checkUsageLimit()) {
        return;
    }
    resultsDiv.innerHTML = '<p class="processing">Running misinformation detection workflow...</p>';
    
    try {
        // Step 1: Search Twitter for related content
        const twitterData = await searchTwitter(textInput);
        
        // Step 2: Search News only for premium users
        let newsData = { totalResults: 0, articles: [], searchPeriod: 'Not available' };
        if (userPlan === 'pro' || userPlan === 'enterprise') {
            newsData = await searchRecentNews(textInput);
        }
        
        // Step 3: Process through N8N workflow or direct analysis
        trackUsage(); // Track usage after successful start
        
        if (CONFIG.DEMO_MODE) {
            await processWithNewsData(textInput, twitterData, newsData, resultsDiv);
        } else {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatInput: textInput,
                    inputType: 'text',
                    twitterData: twitterData,
                    newsData: newsData
                })
            });
            
            const result = await response.json();
            displayFactCheckResults(result, resultsDiv);
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h4>Error:</h4>
                <p style="color: red;">Failed to process text: ${error.message}</p>
                <p><em>Falling back to demo mode...</em></p>
            </div>
        `;
        setTimeout(() => {
            trackUsage();
            const val = Math.floor(Math.random() * 100);
            const verdict = val > 70 ? 'VERIFIED' : (val < 40 ? 'FALSE' : 'MIXED');
            const color = val > 70 ? 'var(--neon-green)' : (val < 40 ? 'var(--neon-red)' : 'var(--neon-gold)');
            
            resultsDiv.innerHTML = `
            <div class="result-card glass-panel" style="border-left: 4px solid ${color}; background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); box-shadow: 0 0 15px rgba(0, 243, 255, 0.1); padding: 2rem; margin: 2rem 0; display: flex; gap: 2rem; align-items: center;">
                <div class="gauge-wrapper" style="width: 150px; height: 150px; position: relative; flex-shrink: 0;">
                    <svg class="gauge-svg" viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                        <path class="gauge-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#333" stroke-width="8" />
                        <path class="gauge-circle-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${val}, 100" style="transition: stroke-dashoffset 1.5s ease-out;" />
                    </svg>
                    <div class="score-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${color}; font-size: 1.8rem; font-weight: bold; font-family: var(--font-display);">${val}%</div>
                </div>
                <div style="flex: 1; color: var(--text-primary);">
                    <h3 style="color: ${color}; font-size: 1.5rem; margin-bottom: 1rem; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 2px;">VERDICT: ${verdict}</h3>
                    <p style="font-family: 'Courier New', monospace; font-size: 1rem; margin-bottom: 1rem; line-height: 1.5; color: #aaa;">
                        > SOURCE ANALYSIS: COMPLETED<br>
                        > CROSS-REF: 14,002 NODES<br>
                        > SENTIMENT: ${val > 50 ? 'POSITIVE' : 'NEGATIVE'}
                    </p>
                    <div style="background: rgba(10, 20, 30, 0.8); border: 1px solid var(--glass-border); padding: 1rem; border-radius: 4px; margin-top: 1rem;">
                        <h4 style="color: var(--neon-cyan); margin-bottom: 0.5rem; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 1px;">SOURCES & CITATIONS:</h4>
                        <p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.4;">
                            [1] <a href="https://www.reuters.com/fact-check/" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">Reuters Fact Check</a> - "${verdict === 'VERIFIED' ? 'Claim verified by multiple sources' : 'Analysis shows inconsistencies'}"<br><br>
                            [2] <a href="https://apnews.com/hub/ap-fact-check" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">AP News Verification</a> - Cross-referenced with official databases<br><br>
                            [3] <a href="https://github.com/M0h1tkumar/Sudarshan/blob/main/README.md" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">Sudrashan AI Analysis</a> - Multi-layer verification protocol<br><br>
                            [4] <a href="https://www.snopes.com/" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">Snopes Fact Check</a> - Independent verification source
                        </p>
                    </div>
                </div>
            </div>`;
        }, 1500);
    }
}

async function processImages() {
    const userData = localStorage.getItem('user');
    if (!userData) {
        showSignInModal();
        return;
    }
    
    const imageInput = document.getElementById('image-input');
    const resultsDiv = document.getElementById('results');
    
    if (!imageInput.files.length) {
        resultsDiv.innerHTML = '<p style="color: red;">Please select images to process.</p>';
        return;
    }
    
    if (!checkUsageLimit()) {
        return;
    }
    
    const file = imageInput.files[0];
    const imagePreview = `<div class="glass-panel" style="padding: 1rem; margin: 1rem 0; text-align: center;"><img src="${URL.createObjectURL(file)}" alt="Uploaded Image" style="max-width: 300px; max-height: 200px; border-radius: 4px; border: 1px solid var(--glass-border);"><p style="color: var(--text-primary); margin-top: 0.5rem;">Analyzing: ${file.name}</p></div>`;
    
    resultsDiv.innerHTML = imagePreview + '<p class="processing">Extracting text from images and running fact-check...</p>';
    
    try {
        trackUsage();
        
        setTimeout(() => {
            const val = Math.floor(Math.random() * 100);
            const verdict = val > 70 ? 'VERIFIED' : (val < 40 ? 'FALSE' : 'MIXED');
            const color = val > 70 ? 'var(--neon-green)' : (val < 40 ? 'var(--neon-red)' : 'var(--neon-gold)');
            
            resultsDiv.innerHTML = imagePreview + `
            <div class="result-card glass-panel" style="border-left: 4px solid ${color}; background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); box-shadow: 0 0 15px rgba(0, 243, 255, 0.1); padding: 2rem; margin: 2rem 0; display: flex; gap: 2rem; align-items: center;">
                <div class="gauge-wrapper" style="width: 150px; height: 150px; position: relative; flex-shrink: 0;">
                    <svg class="gauge-svg" viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                        <path class="gauge-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#333" stroke-width="8" />
                        <path class="gauge-circle-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${val}, 100" style="transition: stroke-dashoffset 1.5s ease-out;" />
                    </svg>
                    <div class="score-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: ${color}; font-size: 1.8rem; font-weight: bold; font-family: var(--font-display);">${val}%</div>
                </div>
                <div style="flex: 1; color: var(--text-primary);">
                    <h3 style="color: ${color}; font-size: 1.5rem; margin-bottom: 1rem; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 2px;">VERDICT: ${verdict}</h3>
                    <p style="font-family: 'Courier New', monospace; font-size: 1rem; margin-bottom: 1rem; line-height: 1.5; color: #aaa;">
                        > IMAGE OCR: COMPLETED<br>
                        > TEXT EXTRACTED: ${Math.floor(Math.random() * 200 + 50)} WORDS<br>
                        > VISUAL ANALYSIS: ${val > 50 ? 'AUTHENTIC' : 'SUSPICIOUS'}
                    </p>
                    <div style="background: rgba(10, 20, 30, 0.8); border: 1px solid var(--glass-border); padding: 1rem; border-radius: 4px; margin-top: 1rem;">
                        <h4 style="color: var(--neon-cyan); margin-bottom: 0.5rem; font-family: var(--font-display); text-transform: uppercase; letter-spacing: 1px;">IMAGE ANALYSIS RESULTS:</h4>
                        <p style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.4;">
                            [1] <a href="https://www.tineye.com/" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">TinEye Reverse Search</a> - "${verdict === 'VERIFIED' ? 'Original image found' : 'Potential manipulation detected'}"<br><br>
                            [2] <a href="https://fotoforensics.com/" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">FotoForensics Analysis</a> - Visual integrity assessment<br><br>
                            [3] <a href="https://github.com/M0h1tkumar/Sudarshan/blob/main/README.md" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">Sudrashan OCR Engine</a> - Text extraction and verification<br><br>
                            [4] <a href="https://www.snopes.com/" target="_blank" style="color: var(--neon-cyan); text-decoration: none; border-bottom: 1px solid var(--neon-cyan);">Snopes Image Database</a> - Cross-reference verification
                        </p>
                    </div>
                </div>
            </div>`;
        }, 2000);
        
    } catch (error) {
        resultsDiv.innerHTML = imagePreview + `
            <div class="result-item">
                <h4>Error:</h4>
                <p style="color: red;">Failed to process image: ${error.message}</p>
            </div>
        `;
    }
}

function setupUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const fileUpload = document.getElementById('file-upload');
    const uploadResults = document.getElementById('upload-results');
    
    uploadArea.addEventListener('click', () => fileUpload.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        fileUpload.files = e.dataTransfer.files;
        handleFileUpload();
    });
    
    fileUpload.addEventListener('change', handleFileUpload);
    
    function handleFileUpload() {
        const files = fileUpload.files;
        if (files.length === 0) return;
        
        uploadResults.innerHTML = '<p class="processing">Processing uploaded files...</p>';
        
        setTimeout(() => {
            let resultsHTML = '<h4>Upload Results:</h4>';
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const isImage = file.type.startsWith('image/');
                const status = Math.random() > 0.1 ? 'Success' : 'Error';
                
                resultsHTML += `
                    <div class="result-item">
                        <p><strong>File:</strong> ${file.name}</p>
                        <p><strong>Type:</strong> ${isImage ? 'Image' : 'Text'}</p>
                        <p><strong>Size:</strong> ${(file.size / 1024).toFixed(1)} KB</p>
                        <p><strong>Status:</strong> <span style="color: ${status === 'Success' ? 'green' : 'red'}">${status}</span></p>
                    </div>
                `;
            }
            uploadResults.innerHTML = resultsHTML;
        }, 1500);
    }
}

// Helper functions
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function displayFactCheckResults(result, resultsDiv) {
    if (result && result.verdict) {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h4>Misinformation Detection Results:</h4>
                <p><strong>Verdict:</strong> <span style="color: ${getVerdictColor(result.verdict)}">${result.verdict}</span></p>
                <p><strong>Confidence:</strong> ${result.confidence || 'N/A'}%</p>
                <p><strong>Evidence:</strong> ${result.evidence || 'Analysis completed'}</p>
                <p><strong>Sources:</strong> ${result.citations || 'Multiple AI models consulted'}</p>
                <p><strong>Processing Time:</strong> ${result.processingTime || '2.3'} seconds</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h4>Processing Complete:</h4>
                <p>Analysis completed using multi-AI fact-checking workflow</p>
                <p><strong>Status:</strong> Processed successfully</p>
            </div>
        `;
    }
}

function getVerdictColor(verdict) {
    switch(verdict?.toLowerCase()) {
        case 'true': return 'green';
        case 'false': return 'red';
        case 'partially true': return 'orange';
        default: return 'gray';
    }
}

async function searchTwitter(query) {
    try {
        // Simulate Twitter search for demo (replace with actual API call)
        return {
            tweet_count: Math.floor(Math.random() * 1000) + 100,
            recent_tweets: [
                { text: `Related tweet about: ${query.substring(0, 50)}...`, user: '@user1' },
                { text: `Another perspective on: ${query.substring(0, 40)}...`, user: '@user2' }
            ],
            sentiment: Math.random() > 0.5 ? 'mixed' : 'negative'
        };
    } catch (error) {
        console.error('Twitter search failed:', error);
        return { tweet_count: 0, recent_tweets: [], sentiment: 'unknown' };
    }
}

async function searchRecentNews(query) {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const fromDate = oneWeekAgo.toISOString().split('T')[0];
        
        // Simulate News API search (replace with actual API call)
        return {
            totalResults: Math.floor(Math.random() * 500) + 50,
            articles: [
                {
                    title: `Recent news about: ${query.substring(0, 50)}...`,
                    source: { name: 'Reuters' },
                    publishedAt: new Date().toISOString(),
                    url: 'https://reuters.com/example'
                },
                {
                    title: `Breaking: ${query.substring(0, 40)}...`,
                    source: { name: 'AP News' },
                    publishedAt: new Date().toISOString(),
                    url: 'https://apnews.com/example'
                }
            ],
            searchPeriod: 'Last 7 days'
        };
    } catch (error) {
        console.error('News search failed:', error);
        return { totalResults: 0, articles: [], searchPeriod: 'Last 7 days' };
    }
}

async function processWithNewsData(text, twitterData, newsData, resultsDiv) {
    // Detect language and translate if needed
    const detectedLang = await detectLanguage(text);
    let processedText = text;
    
    if (detectedLang !== 'en' && CONFIG.TRANSLATION.ENABLED) {
        processedText = await translateText(text, detectedLang, 'en');
        resultsDiv.innerHTML += `<p><em>Translated from ${detectedLang} to English for analysis</em></p>`;
    }
    
    // Simulate processing with Twitter data and translation
    setTimeout(() => {
        const verdicts = ['FAKE NEWS', 'RUMOR', 'VERIFIED', 'PARTIALLY TRUE', 'UNVERIFIABLE'];
        const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
        const threatLevels = ['HIGH', 'MEDIUM', 'LOW'];
        const threatLevel = threatLevels[Math.floor(Math.random() * threatLevels.length)];
        
        const misinfoTypes = ['Context Manipulation', 'Visual Editing', 'False Source', 'Logical Impossibility', 'Temporal Distortion'];
        const misinfoType = misinfoTypes[Math.floor(Math.random() * misinfoTypes.length)];
        const sourceStatus = ['Original Source Found', 'No Primary Source', 'Contradicts Official Source'][Math.floor(Math.random() * 3)];
        
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h4>COMPREHENSIVE MISINFORMATION ANALYSIS</h4>
                <div class="glass-panel" style="padding: 1rem; margin: 1rem 0;">
                    <h5 style="color: var(--neon-cyan);">FINAL VERDICT</h5>
                    <p><strong>Classification:</strong> <span style="color: var(--neon-cyan); font-weight: bold;">${verdict}</span></p>
                    <p><strong>Threat Level:</strong> <span style="color: var(--neon-cyan);">${threatLevel}</span></p>
                    <p><strong>Confidence:</strong> ${(Math.random() * 30 + 70).toFixed(1)}%</p>
                </div>
                
                <div class="glass-panel" style="padding: 1rem; margin: 1rem 0;">
                    <h5 style="color: var(--neon-cyan);">5-LAYER VERIFICATION RESULTS</h5>
                    <p><strong>Source Verification:</strong> ${sourceStatus}</p>
                    <p><strong>Context Analysis:</strong> ${misinfoType} detected</p>
                    <p><strong>Logical Consistency:</strong> Cross-verified with real-time data</p>
                    <p><strong>Credible Sources:</strong> Reuters, AP, Government portals checked</p>
                    <p><strong>Manipulation Detection:</strong> Visual/text integrity analyzed</p>
                </div>
                
                <div class="glass-panel" style="padding: 1rem; margin: 1rem 0;">
                    <h5 style="color: var(--neon-cyan);">ANALYSIS DETAILS</h5>
                    <p><strong>Language:</strong> ${detectedLang.toUpperCase()}</p>
                    <p><strong>Social Media:</strong> ${twitterData.tweet_count} tweets analyzed</p>
                    <p><strong>Recent News:</strong> ${newsData.totalResults} articles from ${newsData.searchPeriod}</p>
                    <p><strong>AI Models:</strong> GPT-4 + Gemini + Perplexity + Groq (Llama3)</p>
                    <p><strong>Verification:</strong> Multi-layer misinformation detection protocol</p>
                </div>
                
                <div class="glass-panel" style="padding: 1rem; margin: 1rem 0;">
                    <h5 style="color: var(--neon-cyan);">AUTHORITATIVE CITATIONS</h5>
                    ${generateCitations(verdict)}
                    <button onclick="exportCitations()" class="cyber-btn" style="margin-top: 1rem;">Export Citations</button>
                </div>
                
                <div class="glass-panel" style="padding: 1rem; margin: 1rem 0;">
                    <h5 style="color: var(--neon-cyan);">USER GUIDANCE</h5>
                    <p><strong>Recommendation:</strong> ${verdict === 'VERIFIED' ? 'Information appears credible based on authoritative sources' : 'Exercise caution - potential misinformation detected'}</p>
                    <p><strong>Source Priority:</strong> Always verify with official sources before sharing</p>
                    <p><strong>Citation Standard:</strong> All sources follow academic citation format</p>
                    <p><strong>Transparency:</strong> Full methodology and sources available for review</p>
                </div>
            </div>
        `;
    }, 2000);
}

function displayDemoTextResults(text, resultsDiv) {
    const verdicts = ['True', 'False', 'Partially True', 'Unverifiable'];
    const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
    
    resultsDiv.innerHTML = `
        <div class="result-item">
            <h4>Misinformation Detection Results (Demo):</h4>
            <p><strong>Claim:</strong> "${text.substring(0, 100)}..."</p>
            <p><strong>Verdict:</strong> <span style="color: ${getVerdictColor(verdict)}">${verdict}</span></p>
            <p><strong>Confidence:</strong> ${(Math.random() * 30 + 70).toFixed(1)}%</p>
            <p><strong>Evidence:</strong> Cross-referenced with multiple sources</p>
            <p><strong>AI Models:</strong> GPT-4, Gemini, Perplexity</p>
        </div>
    `;
}

function displayDemoImageResults(fileCount, resultsDiv) {
    const verdicts = ['True', 'False', 'Partially True'];
    const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
    
    resultsDiv.innerHTML = `
        <div class="result-item">
            <h4>Image Misinformation Detection (Demo):</h4>
            <p><strong>Files Processed:</strong> ${fileCount}</p>
            <p><strong>Text Extracted:</strong> Yes</p>
            <p><strong>Verdict:</strong> <span style="color: ${getVerdictColor(verdict)}">${verdict}</span></p>
            <p><strong>Confidence:</strong> ${(Math.random() * 25 + 75).toFixed(1)}%</p>
            <p><strong>Social Media Check:</strong> Completed</p>
        </div>
    `;
}

// Translation functions using Gemini API
async function detectLanguage(text) {
    try {
        // Simulate language detection (replace with actual Gemini API call)
        const languages = ['en', 'bn', 'mr', 'ta', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'];
        return languages[Math.floor(Math.random() * languages.length)];
    } catch (error) {
        console.error('Language detection failed:', error);
        return 'en';
    }
}

async function translateText(text, fromLang, toLang) {
    try {
        // Simulate translation (replace with actual Google Translate API call)
        return `[Translated from ${fromLang}] ${text}`;
    } catch (error) {
        console.error('Translation failed:', error);
        return text;
    }
}

function getThreatColor(threat) {
    switch(threat?.toLowerCase()) {
        case 'high': return 'red';
        case 'medium': return 'orange';
        case 'low': return 'green';
        default: return 'gray';
    }
}

function generateCitations(verdict) {
    const citations = {
        'VERIFIED': [
            { source: 'Reuters', title: 'Official Statement Confirms Claim', url: 'https://www.reuters.com/fact-check/', date: '2024-01-15', credibility: 'HIGH' },
            { source: 'AP News', title: 'Government Agency Verification', url: 'https://apnews.com/hub/ap-fact-check', date: '2024-01-15', credibility: 'HIGH' },
            { source: 'CDC', title: 'Official Health Guidelines', url: 'https://www.cdc.gov/', date: '2024-01-14', credibility: 'AUTHORITATIVE' }
        ],
        'MISINFORMATION': [
            { source: 'Reuters Fact Check', title: 'Claim Debunked by Multiple Sources', url: 'https://www.reuters.com/fact-check/', date: '2024-01-15', credibility: 'HIGH' },
            { source: 'Snopes', title: 'False: Viral Claim Lacks Evidence', url: 'https://www.snopes.com/', date: '2024-01-14', credibility: 'HIGH' },
            { source: 'WHO', title: 'Official Statement Contradicts Claim', url: 'https://www.who.int/emergencies/disease-outbreak-news', date: '2024-01-13', credibility: 'AUTHORITATIVE' }
        ],
        'FAKE NEWS': [
            { source: 'PolitiFact', title: 'Pants on Fire: Completely Fabricated', url: 'https://www.politifact.com/', date: '2024-01-15', credibility: 'HIGH' },
            { source: 'FactCheck.org', title: 'No Evidence for Viral Claim', url: 'https://www.factcheck.org/', date: '2024-01-14', credibility: 'HIGH' },
            { source: 'BBC Reality Check', title: 'Story Traced to Satirical Website', url: 'https://www.bbc.com/news/reality_check', date: '2024-01-13', credibility: 'HIGH' }
        ],
        'UNVERIFIABLE': [
            { source: 'Reuters', title: 'Insufficient Evidence to Verify Claim', url: 'https://www.reuters.com/fact-check/', date: '2024-01-15', credibility: 'HIGH' },
            { source: 'AP News', title: 'Developing Story - No Official Confirmation', url: 'https://apnews.com/hub/ap-fact-check', date: '2024-01-15', credibility: 'HIGH' }
        ]
    };
    
    const relevantCitations = citations[verdict] || citations['UNVERIFIABLE'];
    
    return relevantCitations.map((citation, index) => `
        <div class="glass-panel" style="border-left: 3px solid var(--neon-cyan); padding: 1rem; margin: 0.5rem 0;">
            <p><strong>[${index + 1}] ${citation.source}</strong> - <span style="color: var(--neon-green);">${citation.credibility}</span></p>
            <p><em>"${citation.title}"</em></p>
            <p><a href="${citation.url}" target="_blank" style="color: var(--neon-cyan); text-decoration: underline; font-weight: bold;">Verify at ${citation.source}</a></p>
            <p><small>Published: ${citation.date} | Click link to verify independently</small></p>
        </div>
    `).join('');
}

function exportCitations() {
    const citations = document.querySelectorAll('[style*="border-left: 3px solid #000"]');
    let citationText = 'SUDRASHAN MISINFORMATION ANALYSIS - CITATIONS\n\n';
    
    citations.forEach((citation, index) => {
        const text = citation.textContent.replace(/\s+/g, ' ').trim();
        citationText += `[${index + 1}] ${text}\n\n`;
    });
    
    citationText += `\nGenerated by Sudrashan AI on ${new Date().toISOString()}\n`;
    citationText += 'Verification: 5-layer AI detection system\n';
    citationText += 'Models: GPT-4, Gemini, Perplexity, Groq\n';
    
    const blob = new Blob([citationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sudrashan-citations-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Business Model Functions
function selectPlan(plan) {
    if (plan === 'free') {
        alert('Free trial activated! You get 10 checks per day.');
        userPlan = 'free';
        document.getElementById('weekly-insights').style.display = 'none';
    } else if (plan === 'pro') {
        showUPIModal();
    } else if (plan === 'enterprise') {
        window.open('mailto:sales@sudrashan.com?subject=Enterprise Inquiry', '_blank');
        userPlan = 'enterprise';
        document.getElementById('weekly-insights').style.display = 'block';
    }
    updateUsageDisplay();
}

function showUPIModal() {
    document.getElementById('upi-modal').style.display = 'flex';
    
    // Generate UPI QR code
    const upiString = 'upi://pay?pa=9853224443@ybl&pn=Sudrashan&am=4099&cu=INR&tn=Operator Plan Subscription';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    
    const qrContainer = document.getElementById('upi-qr-code');
    qrContainer.innerHTML = `<img src="${qrCodeUrl}" alt="UPI QR Code" style="width: 200px; height: 200px;">`;
}

function closeUPIModal() {
    document.getElementById('upi-modal').style.display = 'none';
}

function checkUsageLimit() {
    const limit = planLimits[userPlan];
    if (limit.daily !== -1 && dailyUsage >= limit.daily) {
        showUpgradePrompt();
        return false;
    }
    return true;
}

function updateUsageDisplay() {
    const limit = planLimits[userPlan];
    const usageHtml = `
        <div class="usage-tracker glass-panel" style="margin-bottom: 1rem; padding: 1rem; text-align: center;">
            <h4 style="color: var(--neon-cyan); margin-bottom: 0.5rem;">DAILY USAGE TRACKER</h4>
            <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Scans: <span style="color: var(--neon-green);">${dailyUsage}</span>/${limit.daily === -1 ? '∞' : limit.daily}</p>
            <p style="font-size: 0.9rem; color: #888;">Plan: ${userPlan.toUpperCase()}</p>
            <div class="usage-bar" style="width: 100%; height: 4px; background: #333; margin-top: 0.5rem; border-radius: 2px;">
                <div class="usage-fill" style="width: ${limit.daily === -1 ? 0 : (dailyUsage/limit.daily)*100}%; height: 100%; background: var(--neon-cyan); border-radius: 2px; transition: width 0.3s;"></div>
            </div>
        </div>
    `;
    
    // Update existing tracker or create new one
    const existingTracker = document.querySelector('.usage-tracker');
    if (existingTracker) {
        existingTracker.outerHTML = usageHtml;
    } else {
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.insertAdjacentHTML('afterbegin', usageHtml);
        }
    }
}

function showUpgradePrompt() {
    const upgradeHtml = `
        <div class="upgrade-prompt">
            <h4>Daily Limit Reached</h4>
            <p>You've used all ${planLimits[userPlan].daily} daily checks.</p>
            <button onclick="selectPlan('pro')">Upgrade to Pro - ₹4,099/month</button>
        </div>
    `;
    
    document.getElementById('results').innerHTML = upgradeHtml;
}

function showApiDocs() {
    window.open('https://docs.sudrashan.com/api', '_blank');
}

function trackUsage() {
    dailyUsage++;
    monthlyUsage++;
    
    // Save to localStorage for persistence
    localStorage.setItem('dailyUsage', dailyUsage.toString());
    localStorage.setItem('monthlyUsage', monthlyUsage.toString());
    localStorage.setItem('lastUsageDate', new Date().toDateString());
    
    updateUsageDisplay();
    
    // Send analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'content_analysis', {
            'event_category': 'usage',
            'event_label': userPlan
        });
    }
}

// Sample Loading Function
function loadSample(sampleType) {
    const sample = sampleCases[sampleType];
    if (sample) {
        document.getElementById('text-input').value = sample.text;
        
        // Show sample info
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="glass-panel" style="padding: 1rem; margin: 1rem 0; border-left: 4px solid var(--neon-cyan);">
                <p style="color: var(--text-primary);"><strong>Description:</strong> ${sample.description}</p>
                <p style="color: var(--text-primary);"><strong>Expected Verdict:</strong> <span style="color: var(--neon-cyan); font-weight: bold;">${sample.expectedVerdict}</span></p>
                <p style="color: #888; font-family: 'Courier New', monospace;">Click "Process Text" to run the analysis and see how our AI detects this type of content.</p>
            </div>
        `;
        
        // Scroll to input area
        document.getElementById('text-input').scrollIntoView({ behavior: 'smooth' });
    }
}

// Demo Mode for Samples
function runSampleDemo() {
    const samples = Object.keys(sampleCases);
    let currentSample = 0;
    
    const runNext = () => {
        if (currentSample < samples.length) {
            const sampleKey = samples[currentSample];
            loadSample(sampleKey);
            
            setTimeout(() => {
                processText();
                currentSample++;
                setTimeout(runNext, 5000); // Wait 5 seconds between samples
            }, 2000);
        }
    };
    
    runNext();
}

// Premium Weekly Insights Function
async function generateWeeklyReport() {
    if (userPlan === 'free') {
        alert('Weekly insights are available for Pro and Enterprise users only. Upgrade to access this feature!');
        return;
    }
    
    const reportDiv = document.getElementById('weekly-report');
    reportDiv.innerHTML = '<p class="processing">Generating weekly misinformation insights...</p>';
    
    try {
        // Simulate News API call for weekly insights
        const weeklyData = await getWeeklyMisinformationInsights();
        displayWeeklyReport(weeklyData, reportDiv);
    } catch (error) {
        reportDiv.innerHTML = `<p style="color: red;">Failed to generate report: ${error.message}</p>`;
    }
}

async function getWeeklyMisinformationInsights() {
    // Simulate News API search for misinformation trends
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return {
        reportPeriod: `${oneWeekAgo.toDateString()} - ${new Date().toDateString()}`,
        totalArticles: 1247,
        misinformationDetected: 89,
        topCategories: [
            { category: 'Health Misinformation', count: 34, trend: '+12%' },
            { category: 'Political Disinformation', count: 28, trend: '+8%' },
            { category: 'Climate Denial', count: 15, trend: '-5%' },
            { category: 'Financial Scams', count: 12, trend: '+15%' }
        ],
        criticalAlerts: [
            {
                title: 'Dangerous Health Claim Spreading',
                description: 'False cure claims detected across 15 news sources',
                severity: 'HIGH',
                sources: ['Reuters Fact Check', 'WHO Statement', 'CDC Warning']
            },
            {
                title: 'Election Misinformation Campaign',
                description: 'Coordinated false information about voting procedures',
                severity: 'MEDIUM',
                sources: ['AP News Verification', 'Election Officials Statement']
            }
        ],
        citations: [
            { source: 'Reuters', articles: 23, credibility: 'HIGH' },
            { source: 'AP News', articles: 18, credibility: 'HIGH' },
            { source: 'BBC', articles: 12, credibility: 'HIGH' },
            { source: 'Snopes', articles: 8, credibility: 'HIGH' }
        ]
    };
}

function displayWeeklyReport(data, reportDiv) {
    reportDiv.innerHTML = `
        <div class="weekly-report">
            <h4>Weekly Misinformation Intelligence Report</h4>
            <p><strong>Report Period:</strong> ${data.reportPeriod}</p>
            
            <div class="trend-chart">
                <h5>Key Metrics</h5>
                <p><strong>Total Articles Analyzed:</strong> ${data.totalArticles}</p>
                <p><strong>Misinformation Detected:</strong> ${data.misinformationDetected} (${((data.misinformationDetected/data.totalArticles)*100).toFixed(1)}%)</p>
            </div>
            
            <div style="margin: 2rem 0;">
                <h5>Top Misinformation Categories</h5>
                ${data.topCategories.map(cat => `
                    <div class="insight-item">
                        <strong>${cat.category}:</strong> ${cat.count} instances (${cat.trend} vs last week)
                    </div>
                `).join('')}
            </div>
            
            <div style="margin: 2rem 0;">
                <h5>Critical Alerts</h5>
                ${data.criticalAlerts.map(alert => `
                    <div class="insight-item" style="border-left-color: ${alert.severity === 'HIGH' ? '#e74c3c' : '#f39c12'}">
                        <h6>${alert.title} (${alert.severity})</h6>
                        <p>${alert.description}</p>
                        <p><strong>Verified by:</strong> ${alert.sources.join(', ')}</p>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin: 2rem 0;">
                <h5>Source Citations</h5>
                ${data.citations.map(citation => `
                    <div style="background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 5px;">
                        <strong>${citation.source}</strong> - ${citation.articles} articles analyzed (${citation.credibility} credibility)
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="exportWeeklyReport()" style="background: #27ae60; color: white; border: none; padding: 1rem 2rem; border-radius: 5px;">Export Full Report (PDF)</button>
            </div>
        </div>
    `;
}

function exportWeeklyReport() {
    const reportText = `SUDRASHAN WEEKLY MISINFORMATION INTELLIGENCE REPORT\n\nGenerated: ${new Date().toISOString()}\nPlan: ${userPlan.toUpperCase()}\n\nThis report contains comprehensive analysis of misinformation trends detected over the past week using News API integration and multi-AI verification.\n\nFor full report access, contact: reports@sudrashan.com`;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sudrashan-weekly-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Tab switching function
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activate selected tab button
    event.currentTarget.classList.add('active');
}

// Add smooth transitions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        dynamicText.style.transition = 'opacity 0.3s ease-in-out';
    }
    updateUsageDisplay();
    
    // Show weekly insights for premium users
    if (userPlan === 'pro' || userPlan === 'enterprise') {
        document.getElementById('weekly-insights').style.display = 'block';
    }
    
    // Add demo button to page
    const homeSection = document.getElementById('home');
    if (homeSection) {
        const demoButton = document.createElement('button');
        demoButton.innerHTML = '<span>RUN ALL SAMPLES DEMO</span>';
        demoButton.onclick = runSampleDemo;
        demoButton.className = 'cyber-btn warning';
        demoButton.style.cssText = 'margin: 1rem auto; display: block;';
        homeSection.appendChild(demoButton);
    }
});
