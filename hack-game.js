// ===== ICE BREAKER GAME =====

class IceBreakerGame {
    constructor() {
        this.level = 1;
        this.trace = 0;
        this.time = 60;
        this.isPlaying = false;
        this.codeLength = 4;
        this.pattern = [];
        this.playerGuess = [];
        this.timerInterval = null;

        this.elements = {
            level: document.getElementById('levelDisplay'),
            trace: document.getElementById('traceDisplay'),
            time: document.getElementById('timeDisplay'),
            difficulty: document.getElementById('difficultyDisplay'),
            grid: document.getElementById('codeGrid'),
            traceFill: document.getElementById('traceFill'),
            traceWarning: document.getElementById('traceWarning'),
            codeInput: document.getElementById('codeInput'),
            hint: document.getElementById('hintText'),
            message: document.getElementById('gameMessage'),
            messageTitle: document.getElementById('messageTitle'),
            messageText: document.getElementById('messageText'),
            startBtn: document.getElementById('startBtn'),
            overlay: document.getElementById('overlay'),
            overlayTitle: document.getElementById('overlayTitle'),
            overlayText: document.getElementById('overlayText'),
            overlayStats: document.getElementById('overlayStats'),
            retryBtn: document.getElementById('retryBtn'),
            closeOverlay: document.getElementById('closeOverlay'),
            hackBtn: document.getElementById('hackBtn')
        };

        this.chars = '0123456789ABCDEF';
        this.difficulties = [
            { name: 'EASY', length: 4, time: 60, class: 'easy' },
            { name: 'MEDIUM', length: 5, time: 50, class: 'medium' },
            { name: 'HARD', length: 6, time: 40, class: 'hard' },
            { name: 'ICE', length: 7, time: 35, class: 'hard' },
            { name: 'DEMON', length: 8, time: 30, class: 'hard' }
        ];

        this.init();
    }

    init() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.retryBtn.addEventListener('click', () => this.resetGame());
        this.elements.closeOverlay.addEventListener('click', () => this.closeOverlay());
        this.elements.hackBtn.addEventListener('click', () => this.submitGuess());
        this.elements.codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitGuess();
        });

        this.showMessage('// ICE_BREAKER_TRAINING', 'Welcome to the training program. Crack the codes to prove your skills.');
    }

    showMessage(title, text) {
        this.elements.messageTitle.textContent = title;
        this.elements.messageText.textContent = text;
        this.elements.message.classList.add('active');
    }

    hideMessage() {
        this.elements.message.classList.remove('active');
    }

    startGame() {
        this.hideMessage();
        this.level = 1;
        this.trace = 0;
        this.isPlaying = true;
        this.updateStats();
        this.startLevel();
    }

    startLevel() {
        const diff = this.getDifficulty();
        this.codeLength = diff.length;
        this.time = diff.time;
        this.elements.difficulty.textContent = diff.name;
        this.elements.difficulty.className = 'ice-difficulty ' + diff.class;

        this.generatePattern();
        this.renderGrid(true);
        this.updateStats();

        // Show pattern for 3 seconds
        setTimeout(() => {
            this.renderGrid(false);
            this.elements.codeInput.value = '';
            this.elements.codeInput.focus();
            this.startTimer();
        }, 3000);

        this.updateHint();
    }

    getDifficulty() {
        const index = Math.min(Math.floor((this.level - 1) / 2), this.difficulties.length - 1);
        return this.difficulties[index];
    }

    generatePattern() {
        this.pattern = [];
        for (let i = 0; i < this.codeLength; i++) {
            this.pattern.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
        }
        console.log('Pattern (for testing):', this.pattern.join(''));
    }

    renderGrid(showPattern) {
        this.elements.grid.innerHTML = '';

        const cells = [];
        if (showPattern) {
            // Show the actual pattern
            for (let i = 0; i < this.codeLength; i++) {
                cells.push({ char: this.pattern[i], revealed: true });
            }
            // Fill rest with random chars
            while (cells.length < 12) {
                cells.push({ char: this.chars[Math.floor(Math.random() * this.chars.length)], revealed: false });
            }
        } else {
            // Scramble and hide
            const scrambled = [...this.pattern];
            while (scrambled.length < 12) {
                scrambled.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
            }
            // Shuffle
            for (let i = scrambled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
            }
            for (let i = 0; i < scrambled.length; i++) {
                cells.push({ char: scrambled[i], revealed: false });
            }
        }

        cells.forEach((cell, index) => {
            const div = document.createElement('div');
            div.className = 'code-cell' + (cell.revealed ? ' revealed' : '');
            div.textContent = cell.char;
            div.dataset.index = index;
            div.dataset.char = cell.char;

            if (!showPattern) {
                div.addEventListener('click', () => this.selectCell(div, cell.char));
            }

            this.elements.grid.appendChild(div);
        });
    }

    selectCell(cell, char) {
        if (!this.isPlaying) return;

        cell.classList.add('hint');
        this.playerGuess.push(char);
        this.elements.codeInput.value = this.playerGuess.join('');

        if (this.playerGuess.length === this.codeLength) {
            // Auto-submit when full length reached
            this.submitGuess();
        }
    }

    submitGuess() {
        if (!this.isPlaying) return;

        const guess = this.elements.codeInput.value.toUpperCase();

        if (guess.length !== this.codeLength) {
            this.showFeedback('Code must be ' + this.codeLength + ' characters', 'wrong');
            return;
        }

        this.stopTimer();

        if (guess === this.pattern.join('')) {
            // Correct!
            this.level++;
            this.trace = Math.max(0, this.trace - 10);

            if (this.level > 3 && !localStorage.getItem('zc_ice_complete')) {
                localStorage.setItem('zc_ice_complete', 'true');
                this.showFeedback('Level 3 Complete! Secret page unlocked: /secret.html', 'correct');
            }

            if (this.level > 5 && !localStorage.getItem('zc_ice_master')) {
                localStorage.setItem('zc_ice_master', 'true');
                this.showFeedback('Level 5 Complete! Crew recognition earned!', 'correct');
            }

            setTimeout(() => this.startLevel(), 1500);
        } else {
            // Wrong!
            this.trace += 25;
            this.showFeedback('TRACE DETECTED! Wrong code.', 'wrong');

            if (this.trace >= 100) {
                this.gameOver();
            } else {
                setTimeout(() => this.startLevel(), 1500);
            }
        }

        this.updateStats();
        this.playerGuess = [];
    }

    showFeedback(text, type) {
        const originalHint = this.elements.hint.textContent;
        this.elements.hint.textContent = text;
        this.elements.hint.style.color = type === 'correct' ? 'var(--terminal-green)' : 'var(--neon-pink)';

        setTimeout(() => {
            this.elements.hint.textContent = originalHint;
            this.elements.hint.style.color = '';
        }, 1500);
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.time--;
            this.elements.time.textContent = this.time;

            if (this.time <= 10) {
                this.elements.time.style.color = 'var(--neon-pink)';
            } else {
                this.elements.time.style.color = 'var(--neon-cyan)';
            }

            if (this.time <= 0) {
                this.trace += 25;
                this.updateStats();
                if (this.trace >= 100) {
                    this.gameOver();
                } else {
                    this.startLevel();
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateStats() {
        this.elements.level.textContent = this.level;
        this.elements.trace.textContent = this.trace + '%';
        this.elements.time.textContent = this.time;

        this.elements.traceFill.style.width = this.trace + '%';

        if (this.trace >= 75) {
            this.elements.traceWarning.classList.add('active');
        } else {
            this.elements.traceWarning.classList.remove('active');
        }
    }

    updateHint() {
        const hints = [
            'Look for repeating characters...',
            'The first character is always even...',
            'Check the corners of the grid...',
            'Pattern might be symmetric...',
            'Count the occurrences...',
            'Trust your instincts, runner...'
        ];
        this.elements.hint.textContent = hints[Math.floor(Math.random() * hints.length)];
    }

    gameOver() {
        this.isPlaying = false;
        this.stopTimer();

        this.elements.overlayTitle.textContent = '// TRACE_COMPLETE';
        this.elements.overlayText.textContent = 'They found you. Better luck next time, choom.';
        this.elements.overlayStats.innerHTML = `
            <div class="stat">
                <span class="stat-label">Level Reached:</span>
                <span class="stat-value">${this.level}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Final Trace:</span>
                <span class="stat-value">${this.trace}%</span>
            </div>
        `;
        this.elements.overlay.classList.add('active');
    }

    resetGame() {
        this.elements.overlay.classList.remove('active');
        this.startGame();
    }

    closeOverlay() {
        this.elements.overlay.classList.remove('active');
        this.showMessage('// TRAINING_ENDED', 'Come back when you\'re ready to run.');
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new IceBreakerGame();
});

// Console easter egg
console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║   ZERO_COOL // ICE Breaker Training               ║
    ║                                                   ║
    ║   Pattern for Level 1 is logged above ↑           ║
    ║   (Only visible in console - cheat if you dare)   ║
    ╚═══════════════════════════════════════════════════╝
`);
