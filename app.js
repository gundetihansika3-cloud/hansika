document.addEventListener('DOMContentLoaded', () => {

    // --- Load user from session (set by login) ---
    const authData = sessionStorage.getItem('cyberalert_auth');
    const userData = sessionStorage.getItem('cyberalert_user');
    
    if (!authData) {
        window.location.href = 'login.html';
        return;
    }

    const user = userData ? JSON.parse(userData) : { name: 'User', email: 'user@example.com' };
    
    // Dynamic profile update
    const avatarImg = document.querySelector('.avatar');
    const profileName = document.querySelector('.user-profile'); // Add name display if needed
    if (avatarImg) {
        const nameForAvatar = user.name || user.email.split('@')[0];
        avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=0D8ABC&color=fff&size=128&bold=true`;
        avatarImg.alt = user.name || user.email;
        avatarImg.title = user.name || user.email;
    }

    console.log('👤 Logged in as:', user);

    // --- Navigation Logic (SPA Routing) ---
    const navItems = document.querySelectorAll('.nav-item, .tool-card[data-target]');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('page-title');

    // Title mappings
    const titles = {
        'dashboard': 'Dashboard Overview',
        'reporting': 'Submit a Fraud Report',
        'database': 'Fraud Analytics & Database',
        'investigation': 'Active Investigations',
        'support': 'User Support Hub',
        'admin': 'Law Enforcement Portal',
        'features': 'Smart Tools & Detection'
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            if (item.classList.contains('nav-item')) {
                item.classList.add('active');
            }

            const targetId = item.getAttribute('data-target');
            viewSections.forEach(section => {
                section.classList.remove('active');
                setTimeout(() => {
                    if (!section.classList.contains('active')) {
                        section.classList.add('hidden');
                    }
                }, 10);
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }

            if (titles[targetId]) {
                pageTitle.textContent = titles[targetId];
            }
        });
    });

    // Welcome banner personalization
    const welcomeBanner = document.querySelector('.banner-content h3');
    if (welcomeBanner && user.name) {
        welcomeBanner.textContent = `Welcome back, ${user.name}!`;
    }
});

// --- Feature: Submit Report Mockup ---
function submitReport() {
    const form = document.getElementById('report-form');
    if (form.checkValidity()) {
        Swal.fire({
            title: 'Report Submitted Successfully!',
            text: 'Your case has been securely registered in the CyberAlert Intelligence Hub. A tracking ID will be sent to you.',
            icon: 'success',
            background: '#0F172A',
            color: '#fff',
            confirmButtonColor: '#4F46E5',
            backdrop: `rgba(15, 23, 42, 0.8)`
        }).then(() => {
            form.reset();
            document.querySelector('[data-target="dashboard"]').click();
        });
    } else {
        form.reportValidity();
    }
}

// --- Logout Logic ---
function logout() {
    Swal.fire({
        title: 'Logging Out',
        text: 'Clearing session data...',
        timer: 1000,
        showConfirmButton: false,
        background: '#0F172A',
        color: '#fff',
        didOpen: () => {
            Swal.showLoading();
            sessionStorage.clear(); // Clear all session data
        }
    }).then(() => {
        window.location.href = 'login.html';
    });
}

// --- AI Pattern Analysis ---
function analyzePattern() {
    const input = document.getElementById('ai-input').value;
    const resultDiv = document.getElementById('ai-result');
    if (!input.trim()) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<p class="text-warning"><i class="fas fa-exclamation-triangle"></i> Please enter some text to analyze.</p>';
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Analyzing pattern...</p>';
    
    setTimeout(() => {
        resultDiv.innerHTML = `
            <h4 style="color: #F59E0B;"><i class="fas fa-shield-alt"></i> Analysis Complete</h4>
            <p class="text-sm mt-10"><strong>Risk Level: High</strong> - The text exhibits patterns commonly associated with social engineering and urgency-based phishing.</p>
            <p class="text-sm mt-5 text-dim">Confidence Score: 89%</p>
        `;
    }, 1500);
}

// --- Suspicious Link Checker ---
function checkLink() {
    const input = document.getElementById('link-input').value;
    const resultDiv = document.getElementById('link-result');
    if (!input.trim()) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<p class="text-warning"><i class="fas fa-exclamation-triangle"></i> Please enter a URL.</p>';
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Scanning URL...</p>';
    
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div style="background: rgba(244, 63, 94, 0.2); padding: 10px; border-radius: 5px; border-left: 3px solid #F43F5E;">
                <span style="color: #F43F5E;"><i class="fas fa-times-circle"></i> Suspicious Link Detected</span>
                <p class="text-sm mt-5">This domain was registered recently and is not associated with legitimate services.</p>
            </div>
        `;
    }, 1500);
}

// --- Gamified Quiz ---
const quizQuestions = [
    { q: "What should you do if you receive an unexpected OTP?", options: ["Share it", "Ignore and delete", "Call the number back"], answer: 1 },
    { q: "Which of these is a sign of a phishing email?", options: ["Personalized greeting", "Urgent language and typos", "Official email domain"], answer: 1 },
    { q: "Is it safe to click links in SMS claiming your bank account is suspended?", options: ["Yes, to verify", "No, contact the bank directly", "Only if it looks official"], answer: 1 }
];

let currentQuestion = 0;
let score = 0;

function switchView(targetId) {
    const viewSections = document.querySelectorAll('.view-section');
    viewSections.forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
    }
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    document.querySelector('.quiz-banner').style.display = 'none';
    const content = document.getElementById('quiz-content');
    content.innerHTML = '<div id="quiz-area"></div>';
    renderQuestion();
    switchView('quiz-view');
}

function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    const html = `
        <h4 class="mb-20">Question ${currentQuestion + 1} of ${quizQuestions.length}</h4>
        <p class="mb-20" style="font-size: 1.2rem;">${q.q}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${q.options.map((opt, i) => `
                <button class="btn-secondary" style="text-align: left; padding: 10px;" onclick="answerQuestion(${i})">${opt}</button>
            `).join('')}
        </div>
    `;
    document.getElementById('quiz-area').innerHTML = html;
}

function answerQuestion(selected) {
    if (selected === quizQuestions[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const html = `
        <h4 class="mb-20" style="font-size: 1.5rem; color: #10B981;">Quiz Complete!</h4>
        <p style="font-size: 1.2rem;">You scored ${score} out of ${quizQuestions.length}.</p>
        <button class="btn-primary mt-20" onclick="document.querySelector('[data-target=\\'features\\']').click(); document.querySelector('.quiz-banner').style.display='block';">Return to Smart Tools</button>
    `;
    document.getElementById('quiz-area').innerHTML = html;
}
