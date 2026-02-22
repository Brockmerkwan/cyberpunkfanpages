// ===== LORE PAGE SPECIFIC SCRIPTS =====

// ===== GLITCH TEXT ANIMATION ON SCROLL =====
const glitchTexts = document.querySelectorAll('.glitch-text');

const glitchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            glitchTextEffect(element);
            glitchObserver.unobserve(element);
        }
    });
}, { threshold: 0.5 });

glitchTexts.forEach(text => {
    glitchObserver.observe(text);
});

function glitchTextEffect(element) {
    const original = element.dataset.text;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\';
    let iterations = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
        element.textContent = original
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return original[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        iterations++;
        if (iterations >= maxIterations) {
            clearInterval(interval);
        }
    }, 50);
}

// ===== MEMORIAL CANDLE FLICKER =====
const candles = document.querySelectorAll('.memorial-candle.lit');

candles.forEach(candle => {
    setInterval(() => {
        const intensity = Math.random() * 0.5 + 0.5;
        candle.style.setProperty('--flicker-intensity', intensity);
    }, 100);
});

// ===== ENEMY ROW REVEAL =====
const enemyRows = document.querySelectorAll('.enemy-row');

const enemyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
            enemyObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

enemyRows.forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = 'opacity 0.4s, transform 0.4s';
    enemyObserver.observe(row);
});

// ===== TRIAD CARD HOVER EFFECT =====
const triadCards = document.querySelectorAll('.triad-card');

triadCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Reset all cards
        triadCards.forEach(c => {
            c.style.filter = 'grayscale(0.8)';
            c.style.opacity = '0.5';
        });
        // Highlight hovered
        this.style.filter = 'grayscale(0)';
        this.style.opacity = '1';
    });

    card.addEventListener('mouseleave', function() {
        triadCards.forEach(c => {
            c.style.filter = 'grayscale(0)';
            c.style.opacity = '1';
        });
    });
});

// ===== SYMBOL PULSE ON SCROLL =====
const zcSymbol = document.querySelector('.zc-symbol');

const symbolObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            zcSymbol.classList.add('symbol-active');
        } else {
            zcSymbol.classList.remove('symbol-active');
        }
    });
}, { threshold: 0.5 });

if (zcSymbol) {
    symbolObserver.observe(zcSymbol);
}

// Add CSS for symbol active state dynamically
const style = document.createElement('style');
style.textContent = `
    .zc-symbol.symbol-active .eye {
        animation: eye-pulse 1.5s infinite;
    }

    @keyframes eye-pulse {
        0%, 100% { r: 8; filter: drop-shadow(0 0 10px #00ffff); }
        50% { r: 10; filter: drop-shadow(0 0 20px #00ffff); }
    }

    .zc-symbol.symbol-active .blackwall-ring {
        animation: ring-spin 30s linear infinite;
    }

    @keyframes ring-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== MEMORIAL COUNTDOWN =====
// Calculate years since each member was lost
function updateMemorialDates() {
    const currentYear = 2077;

    const memorials = [
        { name: 'SWITCH', lost: 2075, element: null },
        { name: 'NEON', lost: 2075, element: null },
        { name: 'DEADMAN', lost: 2076, element: null }
    ];

    memorials.forEach(mem => {
        const years = currentYear - mem.lost;
        const dateElement = document.querySelector(`.memorial-card h3:contains("${mem.name}")`)?.nextElementSibling;
        if (dateElement && years > 0) {
            // Could add "X years since lost" text
        }
    });
}

// ===== NAVIGATION ACTIVE STATE =====
const navLinks = document.querySelectorAll('.nav-links a');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinksMenu = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinksMenu.classList.toggle('active');
    });

    // Close nav when clicking a link
    navLinksMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksMenu.classList.remove('active');
        });
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function createScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--neon-purple), var(--neon-cyan));
            z-index: 10000;
            transition: width 0.1s;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progress.style.width = scrollPercent + '%';
    });
}

createScrollProgress();

// ===== EASTER EGG - KONAMI CODE =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Trigger special effect
            document.body.style.animation = 'glitch-intense 0.3s infinite';

            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);

            console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║        ZERO_COOL // HIDDEN PROTOCOL ACTIVATED     ║
    ║                                                   ║
    ║   "The Blackwall is thinner than they say."       ║
    ║   - Echo, 2076                                    ║
    ║                                                   ║
    ║   Contact: [REDACTED]                             ║
    ║   Frequency: [REDACTED]                           ║
    ║   Remember: We see what lies beyond.              ║
    ╚═══════════════════════════════════════════════════╝
            `);

            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add intense glitch animation
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch-intense {
        0%, 100% { transform: translate(0) filter(hue-rotate(0deg)); }
        10% { transform: translate(-5px, 5px) filter(hue-rotate(90deg)); }
        20% { transform: translate(5px, -5px) filter(hue-rotate(180deg)); }
        30% { transform: translate(-5px, -5px) filter(hue-rotate(270deg)); }
        40% { transform: translate(5px, 5px) filter(hue-rotate(0deg)); }
        50% { transform: translate(-5px, 0) filter(hue-rotate(90deg)); }
        60% { transform: translate(5px, 0) filter(hue-rotate(180deg)); }
        70% { transform: translate(0, -5px) filter(hue-rotate(270deg)); }
        80% { transform: translate(0, 5px) filter(hue-rotate(0deg)); }
        90% { transform: translate(-5px, 5px) filter(hue-rotate(90deg)); }
    }
`;
document.head.appendChild(glitchStyle);

// ===== CONSOLE MESSAGE =====
console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║   ZERO_COOL // Night City Netrunners - LORE       ║
    ║                                                   ║
    ║   You've dug deep. Most don't.                    ║
    ║   The truth is out there. Keep digging.           ║
    ║                                                   ║
    ║   Current Operations: Watson // Pacifica          ║
    ║   Status: RECRUITING                              ║
    ╚═══════════════════════════════════════════════════╝
`);
