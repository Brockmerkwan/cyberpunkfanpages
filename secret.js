// ===== SECRET PAGE - BLACK ICE DECRYPTION =====

// Check access clearance
function checkClearance() {
    const iceComplete = localStorage.getItem('zc_ice_complete');
    const iceMaster = localStorage.getItem('zc_ice_master');

    if (!iceComplete) {
        // No clearance - redirect or show access denied
        document.body.innerHTML = `
            <div class="access-denied">
                <div class="scanlines"></div>
                <div class="denied-content">
                    <h1 style="color: var(--neon-pink); font-size: 3rem; text-shadow: 0 0 30px var(--neon-pink);">ACCESS DENIED</h1>
                    <p style="color: var(--text-dim); margin: 2rem 0;">Clearance Level Insufficient</p>
                    <p style="color: var(--text-dim); margin-bottom: 2rem;">Complete ICE Breaker Training (Level 3+) to access this content.</p>
                    <a href="hack-game.html" class="btn-cta primary" style="display: inline-block; padding: 1rem 2rem; border: 2px solid var(--neon-cyan); color: var(--neon-cyan); text-decoration: none; text-transform: uppercase; letter-spacing: 2px;">ACCESS TRAINING</a>
                    <br><br>
                    <a href="index.html" style="color: var(--text-dim); text-decoration: none;">// RETURN TO STREET</a>
                </div>
            </div>
        `;
        return false;
    }
    return true;
}

// Run decryption animation
function runDecryption() {
    const overlay = document.getElementById('decryptOverlay');
    const decryptBar = document.getElementById('decryptBar');
    const doc = document.getElementById('classifiedDoc');
    const hiddenMessage = document.getElementById('hiddenMessage');

    let progress = 0;
    const messages = [
        'BREACHING BLACK ICE...',
        'DECRYPTING LAYER 1...',
        'DECRYPTING LAYER 2...',
        'DECRYPTING LAYER 3...',
        'BYPASSING DEMONS...',
        'ACCESSING SECURE DATA...',
        'DECRYPTION COMPLETE'
    ];

    const messageEl = document.querySelector('.decrypt-content p');

    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Update message
            messageEl.textContent = messages[messages.length - 1];
            messageEl.style.color = 'var(--terminal-green)';

            // Hide overlay
            setTimeout(() => {
                overlay.classList.add('hidden');

                // Show document
                setTimeout(() => {
                    doc.classList.add('visible');

                    // Show hidden message after delay
                    setTimeout(() => {
                        hiddenMessage.classList.add('visible');
                    }, 2000);
                }, 500);
            }, 1000);
        }

        decryptBar.style.width = progress + '%';

        // Update messages based on progress
        const messageIndex = Math.floor((progress / 100) * (messages.length - 1));
        messageEl.textContent = messages[messageIndex];

    }, 200);
}

// Glitch effect on title
function titleGlitch() {
    const title = document.querySelector('.secret-title');
    const original = title.dataset.text;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\';

    setInterval(() => {
        if (Math.random() > 0.95) {
            let iterations = 0;
            const interval = setInterval(() => {
                title.textContent = original
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return original[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                iterations++;
                if (iterations >= 10) {
                    clearInterval(interval);
                    title.textContent = original;
                }
            }, 50);
        }
    }, 100);
}

// Random terminal messages
function showTerminalMessages() {
    const messages = [
        '[SYSTEM] Connection secure',
        '[SYSTEM] Trace protection active',
        '[WARNING] Black ICE detected nearby',
        '[SYSTEM] Data stream encrypted',
        '[WARNING] Multiple intrusion attempts blocked',
        '[SYSTEM] Arasaka firewall bypassed',
        '[WARNING] They know you\'re here'
    ];

    const footer = document.querySelector('.footer-tagline');

    setInterval(() => {
        if (Math.random() > 0.7) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const originalText = footer.innerHTML;

            // Create temporary message
            const tempMsg = document.createElement('span');
            tempMsg.style.color = 'var(--neon-pink)';
            tempMsg.style.marginLeft = '1rem';
            tempMsg.textContent = `// ${msg}`;
            footer.appendChild(tempMsg);

            setTimeout(() => {
                tempMsg.remove();
            }, 3000);
        }
    }, 5000);
}

// Konami code for extra secret
let konamiIndex = 0;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Extra secret unlocked
            const hiddenContent = document.createElement('div');
            hiddenContent.innerHTML = `
                <div style="position: fixed; bottom: 20px; right: 20px; background: var(--bg-panel); border: 2px solid var(--terminal-green); padding: 1rem; z-index: 10001; max-width: 300px;">
                    <p style="color: var(--terminal-green); font-size: 0.75rem; letter-spacing: 1px; margin-bottom: 0.5rem;">// HIDDEN FRAGMENT FOUND</p>
                    <p style="color: var(--text-dim); font-size: 0.8rem;">Fragment 1 of 3: "The AI has a name. It's called Wintermute. It's been waiting."</p>
                    <button onclick="this.parentElement.remove()" style="margin-top: 0.5rem; background: transparent; border: 1px solid var(--terminal-green); color: var(--terminal-green); padding: 0.3rem 0.8rem; cursor: pointer; font-size: 0.7rem;">ACKNOWLEDGE</button>
                </div>
            `;
            document.body.appendChild(hiddenContent);

            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (checkClearance()) {
        runDecryption();
        titleGlitch();
        showTerminalMessages();
    }
});

// Console message
console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║   ZERO_COOL // Secret Page Accessed               ║
    ║                                                   ║
    ║   You've found the truth.                         ║
    ║   But the truth is dangerous.                     ║
    ║                                                   ║
    ║   There are more fragments to find...             ║
    ║   Check the terminal. Check the game.             ║
    ║   They're everywhere if you know where to look.   ║
    ║                                                   ║
    ║   - Glitch                                        ║
    ╚═══════════════════════════════════════════════════╝
`);
