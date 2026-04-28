// FitFeky Optimized Core JavaScript
(function() {
    'use strict';

    // === Quiz Configuration ===
    const quizStorageKey = 'fitfekyQuizLead';
    const totalQuizSteps = 7;
    const analyticsEvents = {
        quizStart: 'quiz_start',
        questionAnswered: 'question_answered',
        quizCompleted: 'quiz_completed',
        emailSubmitted: 'email_submitted',
        resultViewed: 'result_viewed',
        ctaClicked: 'cta_clicked'
    };

    const quizAnswerKeys = { 1: 'gender', 2: 'goal', 3: 'time', 4: 'level', 5: 'obstacle', 6: 'timeline' };

    // === Products Catalog ===
    const products = [
      {
        id: "fat_loss",
        name: "Fat Loss System",
        link: "https://fitburny.gumroad.com/l/tlkhvr",
        price: "$16.99",
        tags: ["lose_weight", "beginner", "busy", "no_time"],
        description: "A complete fat-loss system designed for beginners who need to see results in 30 days."
      },
      {
        id: "flat_belly",
        name: "Flat Belly Reset",
        link: "https://fitburny.gumroad.com/l/tqsfb",
        price: "$16.99",
        tags: ["lose_weight", "women", "fat_belly"],
        description: "Target stubborn midsection fat and reset your metabolism with this focused guide."
      },
      {
        id: "sugar_detox",
        name: "Sugar Detox",
        link: "https://fitburny.gumroad.com/l/ggaqlh",
        price: "$16.99",
        tags: ["no_motivation", "cravings", "lose_weight"],
        description: "Break the sugar habit and reclaim your energy with this step-by-step detox."
      },
      {
        id: "lean_muscle",
        name: "Lean Muscle Builder",
        link: "https://fitburny.gumroad.com/l/wcdhch",
        price: "$19.99",
        tags: ["build_muscle", "beginner", "skinny"],
        description: "Build clean muscle and strength with this beginner-friendly blueprint."
      },
      {
        id: "complete_fit",
        name: "Complete Fit System",
        link: "https://fitburny.gumroad.com/l/fit",
        price: "$19.99",
        tags: ["fitness", "advanced", "general"],
        description: "Our most comprehensive system for total body transformation and fitness."
      }
    ];

    // === State Management ===
    let quizData = {
        answers: { gender: '', goal: '', time: '', level: '', obstacle: '', timeline: '', contact: { name: '', email: '' } },
        tags: [],
        recommendations: { primary: null, upsell: null }
    };

    let resultTimerInterval = null;

    // === Utility Functions ===
    const getEl = (id) => document.getElementById(id);
    const query = (selector) => document.querySelector(selector);
    const queryAll = (selector) => document.querySelectorAll(selector);

    function trackEvent(eventName, extraParams = {}) {
        if (typeof window.gtag !== 'function') return;
        const context = {
            user_type: extraParams.user_type || quizData.answers.gender || 'unknown',
            tags: (extraParams.tags || quizData.tags || []).join(','),
            selected_product: extraParams.selected_product || quizData.recommendations.primary?.name || ''
        };
        window.gtag('event', eventName, { ...context, ...extraParams });
    }

    // === Recommendation Logic ===

    function generateTags(answers) {
        let userTags = [];
        
        // Goal Mapping
        if (answers.goal) userTags.push(answers.goal);
        
        // Time Mapping
        if (answers.time === "under_30") userTags.push("busy");
        
        // Level Mapping
        if (answers.level) userTags.push(answers.level);
        
        // Obstacle Mapping
        if (answers.obstacle) userTags.push(answers.obstacle);
        
        // Additional Context Tags
        if (answers.gender === "female") userTags.push("women");
        if (answers.obstacle === "no_time") userTags.push("no_time");

        return userTags;
    }

    function rankProducts(userTags) {
        const scoredProducts = products.map(product => {
            let score = 0;
            
            // 1. Tag Matching Score
            product.tags.forEach(tag => {
                if (userTags.includes(tag)) score += 1;
            });
            
            // 2. Intent Priority Rules (+10 weight)
            if (userTags.includes("no_time") && product.id === "fat_loss") score += 10;
            if (userTags.includes("fat_belly") && product.id === "flat_belly") score += 10;
            if (userTags.includes("cravings") && product.id === "sugar_detox") score += 10;
            if (userTags.includes("build_muscle") && product.id === "lean_muscle") score += 10;
            if (userTags.includes("advanced") && product.id === "complete_fit") score += 10;
            
            return { ...product, score };
        });

        // 3. Rank by score
        return scoredProducts.sort((a, b) => b.score - a.score);
    }

    function getRecommendations(answers) {
        const userTags = generateTags(answers);
        const ranked = rankProducts(userTags);
        
        return {
            primary: ranked[0],
            upsell: ranked[1]
        };
    }

    function renderResult(primary, upsell) {
        // Primary Product UI
        const elements = {
            'result-product-name': primary.name,
            'result-product-summary': primary.description,
            'result-new-price': primary.price,
            'result-email-span': quizData.answers.contact.email
        };

        for (let id in elements) {
            const el = getEl(id);
            if (el) el.innerText = elements[id];
        }

        const cta = getEl('result-cta-btn');
        if (cta) {
            cta.href = primary.link;
            cta.target = "_blank";
        }

        // Upsell Product UI
        if (upsell) {
            const upsellName = getEl('alt-product-name');
            const upsellCta = getEl('alt-cta-btn');
            const upsellContainer = getEl('alt-product-container');

            if (upsellName) upsellName.innerText = upsell.name;
            if (upsellCta) upsellCta.href = upsell.link;
            if (upsellContainer) upsellContainer.style.display = 'block';
        }

        // Switch View
        const qContainer = query('.quiz-container');
        if (qContainer) qContainer.style.display = 'none';
        const res = getEl('result-container');
        if (res) {
            res.style.display = 'block';
            res.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // === UI Actions ===
    function updateProgress(step) {
        const circles = queryAll('.step-circle');
        if (circles.length === 0) return;
        circles.forEach((c, i) => c.style.background = (i < step) ? '#e31c25' : '#ddd');
        const bar = getEl('quiz-progress-bar');
        if (bar) bar.style.width = ((step - 1) / (totalQuizSteps - 1) * 100) + '%';
    }

    function showQuestion(step) {
        const steps = queryAll('.quiz-step');
        if (steps.length === 0) return;
        steps.forEach(q => {
            q.style.display = 'none';
            q.classList.remove('is-visible');
        });
        const active = getEl('q' + step);
        if (active) {
            active.style.display = 'block';
            setTimeout(() => active.classList.add('is-visible'), 10);
            updateProgress(step);
        }
    }

    window.startQuiz = function(gender) {
        quizData.answers = { gender: gender, goal: '', time: '', level: '', obstacle: '', timeline: '', contact: { name: '', email: '' } };
        if (resultTimerInterval) clearInterval(resultTimerInterval);
        trackEvent(analyticsEvents.quizStart, { user_type: gender, start_source: 'trainer_card' });
        const qContainer = query('.quiz-container');
        const rContainer = getEl('result-container');
        if (qContainer) qContainer.style.display = 'block';
        if (rContainer) rContainer.style.display = 'none';
        const form = getEl('quiz-form');
        if (form) form.reset();
        showQuestion(2);
        getEl('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    window.nextStep = function(currentStep, value, key) {
        const k = key || quizAnswerKeys[currentStep];
        if (k) {
            quizData.answers[k] = value;
            trackEvent(analyticsEvents.questionAnswered, { question_key: k, answer_value: value });
        }
        showQuestion(currentStep + 1);
    };

    window.backStep = function(step) { if (step > 1) showQuestion(step - 1); };

    window.submitQuiz = function(e) {
        if (e) e.preventDefault();
        const nameEl = getEl('quiz-name');
        const emailEl = getEl('quiz-email');
        if (!nameEl || !emailEl) return;
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        if (!name || !email) return;

        quizData.answers.contact = { name, email };
        quizData.recommendations = getRecommendations(quizData.answers);

        localStorage.setItem(quizStorageKey, JSON.stringify(quizData));
        trackEvent(analyticsEvents.quizCompleted);
        renderResult(quizData.recommendations.primary, quizData.recommendations.upsell);
        startTimer();
    };

    function startTimer() {
        if (resultTimerInterval) clearInterval(resultTimerInterval);
        let sec = 24 * 3600;
        const el = getEl('timer');
        if (!el) return;
        resultTimerInterval = setInterval(() => {
            sec--;
            if (sec < 0) return clearInterval(resultTimerInterval);
            const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
            el.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }, 1000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            queryAll('section, .reveal-item').forEach(el => {
                el.classList.add('reveal');
                observer.observe(el);
            });
        }
        queryAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = getEl(href.substring(1));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        const saved = localStorage.getItem(quizStorageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.answers?.contact?.email) {
                    quizData = data;
                    const nameEl = getEl('quiz-name');
                    const emailEl = getEl('quiz-email');
                    if (nameEl) nameEl.value = data.answers.contact.name || '';
                    if (emailEl) emailEl.value = data.answers.contact.email || '';
                }
            } catch(e) {}
        }
        showQuestion(1);
    });

    window.setGoalAndScroll = function(goal) {
        const goals = { 'yoga': 'yoga', 'fitness': 'fitness', 'muscle': 'build_muscle' };
        window.selectedGoal = goals[goal] || goal;
        getEl('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    };

})();
