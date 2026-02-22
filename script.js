// ===== TERMINAL CODE RAIN =====
const terminal = document.getElementById('terminal');
const canvas = document.createElement('canvas');
terminal.appendChild(canvas);

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Cyberpunk symbols + katakana + hex
const chars = '0123456789ABCDEFアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲﾝｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const charArray = chars.split('');
const fontSize = 16;
const columns = Math.ceil(canvas.width / fontSize);
const drops = [];

// Start drops at random positions above screen
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -50;
}

function drawTerminal() {
    // Fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Color gradient - green to purple
        const hue = 120 - (drops[i] / canvas.height) * 180;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
        ctx.font = `${fontSize}px monospace`;

        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = Math.random() * -20;
        }
        drops[i]++;
    }
}

let terminalInterval = setInterval(drawTerminal, 50);

// ===== GLITCH TEXT EFFECT =====
function glitchText(element) {
    const original = element.dataset.text;
    if (!original) return;

    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\';
    let iterations = 0;
    const maxIterations = 12;

    const interval = setInterval(() => {
        element.textContent = original
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return original[index];
                }
                if (char === ' ') return ' ';
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        iterations++;
        if (iterations >= maxIterations) {
            clearInterval(interval);
            element.textContent = original;
        }
    }, 50);
}

// Apply glitch on hover to all glitch elements
document.querySelectorAll('.glitch, .title-glitch, .glitch-small').forEach(el => {
    el.addEventListener('mouseenter', () => glitchText(el));
});

// Initial glitch on load
setTimeout(() => {
    document.querySelectorAll('.title-glitch').forEach(el => glitchText(el));
}, 300);

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    if (!target) return;

    let current = 0;
    const increment = Math.ceil(target / 30);
    const duration = 1500;
    const stepTime = duration / (target / increment);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, stepTime);
}

// Trigger stats animation when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-value[data-count]').forEach(stat => {
                animateCounter(stat);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBoard = document.querySelector('.stats-board');
if (statsBoard) {
    statsObserver.observe(statsBoard);
}

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const overlayMessage = document.getElementById('overlayMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = document.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;
        const handle = document.getElementById('handle').value;
        const age = document.getElementById('age').value;
        const skill = document.getElementById('skill').value;
        const message = document.getElementById('message').value;

        // Encryption simulation
        btn.querySelector('.btn-text').textContent = 'ENCRYPTING...';
        btn.style.borderColor = 'var(--terminal-green)';
        btn.style.color = 'var(--terminal-green)';

        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'TRANSMITTING...';

            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = 'SENT';

                // Show overlay message
                setTimeout(() => {
                    overlayMessage.classList.add('active');
                    contactForm.reset();

                    setTimeout(() => {
                        btn.querySelector('.btn-text').textContent = originalText;
                        btn.style.borderColor = '';
                        btn.style.color = '';
                    }, 500);
                }, 500);
            }, 1500);
        }, 1000);

        console.log('[ZERO_COOL] Transmission received:', { handle, age, skill, message });
    });
}

function closeOverlay() {
    overlayMessage.classList.remove('active');
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.crew-card, .stat-row, .form-group');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s, transform 0.4s';
    revealObserver.observe(el);
});

// ===== CONSOLE EASTER EGG =====
console.log(`
    ╔═══════════════════════════════════════╗
    ║   ZERO_COOL // Night City Netrunners  ║
    ║   STATUS: RECRUITING                  ║
    ║                                       ║
    ║   You found us. Now prove you're      ║
    ║   worth running with.                 ║
    ╚═══════════════════════════════════════╝

    [SYSTEM] Welcome to the crew, choom.
`);

// ===== TYPING EFFECT FOR HERO =====
const typelines = document.querySelectorAll('.typeline');
let typeIndex = 0;

function typeLine(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--terminal-green)';

    let charIndex = 0;
    const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeInterval);
            element.style.borderRight = 'none';

            // Type next line
            if (typeIndex < typelines.length - 1) {
                typeIndex++;
                setTimeout(() => typeLine(typelines[typeIndex]), 500);
            }
        }
    }, 50);
}

// Start typing effect when page loads
setTimeout(() => {
    if (typelines.length > 0) {
        typeLine(typelines[0]);
    }
}, 1000);
