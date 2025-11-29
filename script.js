/**
 * SUDRAHAN v2.0
 * Features: Three.js Bg, Real News API, OAuth Sim, Stripe Sim.
 */

/* =========================================
   1. CONFIGURATION
   ========================================= */
// 🚨 PASTE YOUR FREE API KEY FROM newsapi.org HERE
// If left empty, it will fall back to the "Simulated Archive"
const NEWS_API_KEY = 'd9f20afc07aa4903a685a635d67213ab'; 

// Stripe Public Key (Placeholder)
const STRIPE_PUBLIC_KEY = 'pk_test_TYooMQauvdEDq54NiTphI7jx';

/* =========================================
   2. THREE.JS BACKGROUND SCENE
   ========================================= */
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 25;

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.03, color: 0x00f3ff, transparent: true, opacity: 0.8 });
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    });

    const animate = () => {
        particlesMesh.rotation.y += 0.05 * (mouseX * 0.001 - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (mouseY * 0.001 - particlesMesh.rotation.x);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

/* =========================================
   3. REAL-TIME NEWS FEED (AUTHENTIC)
   ========================================= */
async function fetchRealNews() {
    const feed = document.getElementById('news-feed');
    const timeDisplay = document.getElementById('live-time');
    
    // Update time
    setInterval(() => {
        timeDisplay.innerText = new Date().toLocaleTimeString().toUpperCase();
    }, 1000);

    // 1. Check if Key exists
    if (!NEWS_API_KEY || NEWS_API_KEY.length < 5) {
        console.warn("No API Key detected. Using Archive Simulation.");
        startSimulatedNews(); // Fallback
        return;
    }

    try {
        const url = `https://newsapi.org/v2/top-headlines?language=en&category=technology&apiKey=${NEWS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            feed.innerHTML = ''; // Clear loader
            data.articles.forEach(article => {
                const sentiment = Math.random() > 0.5 ? 'safe' : 'high'; // Mock sentiment on real data
                const tagLabel = sentiment === 'safe' ? 'VERIFIED' : 'ANALYZING';
                
                const div = document.createElement('div');
                div.className = 'news-item';
                div.innerHTML = `
                    <div class="news-meta">
                        <span>${article.source.name}</span> • <span>${new Date(article.publishedAt).toLocaleTimeString()}</span>
                    </div>
                    <div class="news-title"><a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">${article.title}</a></div>
                    <div class="news-snippet">${article.description || 'No detailed description available in this wire.'}</div>
                    <span class="paper-tag ${sentiment}">${tagLabel}</span>
                `;
                feed.appendChild(div);
            });
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("News Fetch Error:", error);
        feed.innerHTML += `<div style="padding:1rem; color:red; font-family:'Courier Prime'">CONNECTION LOST. REVERTING TO ARCHIVE...</div>`;
        setTimeout(startSimulatedNews, 2000);
    }
}

// Fallback: Simulated Archive (If API Key is missing/fails)
function startSimulatedNews() {
    const feed = document.getElementById('news-feed');
    feed.innerHTML = ''; 
    const headlines = [
        { title: "Global Net-Sec Protocols Updated", source: "Reuters Wire", snip: "New encryption standards mandated for all Class-A data streams." },
        { title: "Deepfake Detection Rate hits 99.4%", source: "TechCrunch Archive", snip: "AI models now outperform human forensic analysts in video verification." },
        { title: "Market Crash: Crypto-Assets Frozen", source: "Bloomberg Term", snip: "Central banks halt trading on unregulated decentralized exchanges." },
        { title: "Satellite Grid Offline in Sector 7", source: "AP Wire", snip: "Solar flare activity causes minor disruptions in orbital comms." }
    ];

    headlines.forEach(h => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <div class="news-meta"><span>${h.source}</span> • <span>ARCHIVE</span></div>
            <div class="news-title">${h.title}</div>
            <div class="news-snippet">${h.snip}</div>
            <span class="paper-tag safe">ARCHIVED</span>
        `;
        feed.appendChild(div);
    });
}

/* =========================================
   4. OAUTH & STRIPE INTEGRATION (MOCK)
   ========================================= */
// OAuth
let isLoggedIn = false;
function handleAuth() {
    const btn = document.getElementById('login-btn');
    const status = document.getElementById('user-status');
    const nameDisplay = document.getElementById('username');

    if (!isLoggedIn) {
        // Simulate Google Popup
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CONNECTING...';
        setTimeout(() => {
            isLoggedIn = true;
            btn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> LOGOUT';
            status.classList.remove('hidden');
            nameDisplay.innerText = "COMMANDER_X";
            alert("AUTHENTICATION SUCCESSFUL. WELCOME BACK, OPERATOR.");
        }, 1500);
    } else {
        isLoggedIn = false;
        btn.innerHTML = '<i class="fa-brands fa-google"></i> LOGIN';
        status.classList.add('hidden');
    }
}

// Stripe
function handleStripeCheckout() {
    if (!isLoggedIn) {
        alert("PLEASE LOGIN TO UPGRADE CLEARANCE LEVEL.");
        return;
    }
    
    // In a real app, you would call your backend to create a session
    // const stripe = Stripe(STRIPE_PUBLIC_KEY);
    // stripe.redirectToCheckout({ sessionId: '...' });

    const btn = document.querySelector('.cyber-btn.primary');
    const originalText = btn.innerText;
    btn.innerText = "REDIRECTING TO STRIPE...";
    
    setTimeout(() => {
        // Mock Redirect
        window.open('https://buy.stripe.com/test_mode_placeholder', '_blank');
        btn.innerText = originalText;
        alert("Redirecting to Secure Payment Gateway...");
    }, 1000);
}

/* =========================================
   5. CORE LOGIC (Tabs, Scan, Samples)
   ========================================= */
function switchTab(t) {
    document.querySelectorAll('.tab-btn, .tab-content').forEach(e => e.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${t}')"]`).classList.add('active');
    document.getElementById(`${t}-tab`).classList.add('active');
}

// loadSample function moved to config.js to avoid conflicts

// processText function moved to config.js to avoid conflicts

// Init
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    fetchRealNews(); // Starts the news engine
    document.getElementById('current-year').textContent = new Date().getFullYear();
});