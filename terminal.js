// ===== SECURE TERMINAL =====

class SecureTerminal {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.input = document.getElementById('terminalInput');
        this.output = document.getElementById('terminalBody');

        this.commands = {
            help: this.cmdHelp.bind(this),
            about: this.cmdAbout.bind(this),
            runners: this.cmdRunners.bind(this),
            lore: this.cmdLore.bind(this),
            ops: this.cmdOps.bind(this),
            bounty: this.cmdBounty.bind(this),
            contact: this.cmdContact.bind(this),
            clear: this.cmdClear.bind(this),
            date: this.cmdDate.bind(this),
            echo: this.cmdEcho.bind(this),
            whoami: this.cmdWhoami.bind(this),
            status: this.cmdStatus.bind(this),
            net: this.cmdNet.bind(this),
            crew: this.cmdCrew.bind(this),
            secret: this.cmdSecret.bind(this)
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('focus', () => this.input.focus());

        // Check for ICE game completion
        if (localStorage.getItem('zc_ice_complete')) {
            this.printLine('> SECRET UNLOCKED: Type "secret" for hidden content', 'success');
        }

        // Keep focus on input
        document.addEventListener('click', () => this.input.focus());
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.history.push(command);
                this.historyIndex = this.history.length;
                this.executeCommand(command);
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }

    autocomplete() {
        const partial = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(partial));

        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.printLine('> ' + matches.join('  '), 'info');
        }
    }

    executeCommand(rawCommand) {
        const parts = rawCommand.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        this.printLine(`runner@zero_cool:~$ ${rawCommand}`, 'system');

        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.printLine(`> ERROR: Unknown command '${cmd}'. Type 'help' for available commands.`, 'error');
        }

        this.scrollToBottom();
    }

    printLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;

        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
        line.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${text}`;

        this.output.appendChild(line);
        this.scrollToBottom();
    }

    printRaw(text, type = '') {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.innerHTML = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    // ===== COMMANDS =====

    cmdHelp() {
        this.printRaw(`
<div class="command-output">
    <h4>// AVAILABLE COMMANDS</h4>
    <ul>
        <li><strong>help</strong> - Show this help message</li>
        <li><strong>about</strong> - Crew information</li>
        <li><strong>runners</strong> - List active runners</li>
        <li><strong>lore</strong> - Access crew history</li>
        <li><strong>ops</strong> - Recent operations log</li>
        <li><strong>bounty</strong> - Wanted listings</li>
        <li><strong>contact</strong> - Encrypted contact info</li>
        <li><strong>status</strong> - System status</li>
        <li><strong>net</strong> - Network information</li>
        <li><strong>crew</strong> - Leadership info</li>
        <li><strong>date</strong> - Show system time</li>
        <li><strong>echo [msg]</strong> - Echo a message</li>
        <li><strong>whoami</strong> - User information</li>
        <li><strong>clear</strong> - Clear terminal screen</li>
    </ul>
    <p class="terminal-tip">TIP: Press TAB for autocomplete, ↑↓ for history</p>
</div>`);
    }

    cmdAbout() {
        this.printRaw(`
<div class="command-output">
    <h4>// ZERO_COOL COLLECTIVE</h4>
    <p>Founded: 2074</p>
    <p>Founder: Marcus "Zero" Chen (MISSING)</p>
    <p>Current Leader: Glitch (Field Commander)</p>
    <p>Territory: Watson (Northside) - Operations Citywide</p>
    <p>Allegiance: Neutral (Anti-Corporate)</p>
    <br>
    <p class="info">"We see what lies beyond. We run what others fear."</p>
</div>`);
    }

    cmdRunners(args) {
        const filter = args[0]?.toLowerCase();

        const runners = [
            { name: 'GLITCH', role: 'Field Commander', status: 'ACTIVE' },
            { name: 'MOONSHADOW', role: 'Tech/Intel', status: 'ACTIVE' },
            { name: 'ECHO', role: 'Deep Net Diver', status: 'ACTIVE' },
            { name: 'RAZOR', role: 'Street Operator', status: 'ACTIVE' },
            { name: 'STATIC', role: 'Communications', status: 'ACTIVE' },
            { name: 'ZERO', role: 'Founder', status: 'MISSING' },
            { name: 'SWITCH', role: 'Runner', status: 'MIA' },
            { name: 'NEON', role: 'Runner', status: 'MIA' }
        ];

        let output = `<div class="command-output"><h4>// ACTIVE RUNNERS</h4>`;

        runners.forEach(r => {
            if (!filter || r.name.toLowerCase().includes(filter) || r.role.toLowerCase().includes(filter)) {
                output += `
                <div class="runner-card">
                    <span class="name">${r.name}</span>
                    <span class="role"> // ${r.role}</span>
                    <div class="status ${r.status === 'ACTIVE' ? 'active' : ''}">[${r.status}]</div>
                </div>`;
            }
        });

        output += `</div>`;
        this.printRaw(output);
    }

    cmdLore() {
        this.printRaw(`
<div class="command-output">
    <h4>// CREW HISTORY SUMMARY</h4>
    <p><strong>2074-Q2:</strong> ZERO_COOL founded by Marcus Chen after discovering Arasaka's Project: Ghostwalker</p>
    <p><strong>2075-Q1:</strong> Night Market Incident - 2 members lost to Maelstrom</p>
    <p><strong>2076-Q3:</strong> Echo makes contact beyond the Blackwall</p>
    <p><strong>2076-Q4:</strong> Zero disappears - Glitch assumes command</p>
    <p><strong>2077-Q2:</strong> Current operations ongoing</p>
    <br>
    <p class="info">For full history, visit: <a href="lore.html" style="color: var(--neon-cyan);">lore.html</a></p>
</div>`);
    }

    cmdOps() {
        const ops = [
            { date: '2077-02-20', target: 'Arasaka Subsidiary', result: 'SUCCESS', details: 'Data extract: 2.4TB' },
            { date: '2077-02-18', target: 'Maelstrom Convoy', result: 'SUCCESS', details: 'Intel on Switch location' },
            { date: '2077-02-15', target: 'NCPD Database', result: 'PARTIAL', details: 'Wanted records purged' },
            { date: '2077-02-10', target: 'Scavenger Den (Heywood)', result: 'SUCCESS', details: '12 civilians rescued' },
            { date: '2077-02-05', target: 'Militech Server', result: 'FAILED', details: 'Trace initiated - 3 runners compromised' }
        ];

        let output = `<div class="command-output"><h4>// RECENT OPERATIONS</h4>
        <table class="bounty-table">
            <tr><th>DATE</th><th>TARGET</th><th>RESULT</th><th>DETAILS</th></tr>`;

        ops.forEach(op => {
            const resultClass = op.result === 'SUCCESS' ? 'success' : op.result === 'FAILED' ? 'error' : 'warning';
            output += `<tr>
                <td>${op.date}</td>
                <td>${op.target}</td>
                <td class="${resultClass}">${op.result}</td>
                <td>${op.details}</td>
            </tr>`;
        });

        output += `</table></div>`;
        this.printRaw(output);
    }

    cmdBounty() {
        const bounties = [
            { name: 'GLITCH', amount: '€$250,000', issuer: 'Maelstrom' },
            { name: 'MOONSHADOW', amount: '€$100,000', issuer: 'Arasaka' },
            { name: 'ZERO', amount: '€$1,000,000', issuer: 'Arasaka (Black Budget)' },
            { name: 'ECHO', amount: '€$500,000', issuer: 'NetWatch' },
            { name: 'ANY ZC MEMBER', amount: '€$50,000+', issuer: 'Various' }
        ];

        let output = `<div class="command-output"><h4>// WANTED LISTINGS</h4>
        <table class="bounty-table">
            <tr><th>TARGET</th><th>BOUNTY</th><th>ISSUED BY</th></tr>`;

        bounties.forEach(b => {
            output += `<tr>
                <td>${b.name}</td>
                <td class="amount">${b.amount}</td>
                <td>${b.issuer}</td>
            </tr>`;
        });

        output += `</table>
        <p class="warning">WARNING: Do not trust anonymous tips about crew locations.</p>
        </div>`;
        this.printRaw(output);
    }

    cmdContact() {
        this.printRaw(`
<div class="command-output">
    <h4>// ENCRYPTED CONTACT</h4>
    <p>To establish contact with ZERO_COOL:</p>
    <br>
    <p>1. Complete the ICE Breaker training (hack-game.html)</p>
    <p>2. Submit recruitment form (index.html#link)</p>
    <p>3. Wait for verification (24-72 hours)</p>
    <br>
    <p class="warning">⚠️ Use burner devices only. Do not use corpo-issued hardware.</p>
    <p class="warning">⚠️ All transmissions are encrypted. Trace time: 3.2 seconds.</p>
</div>`);
    }

    cmdClear() {
        this.output.innerHTML = '';
        this.printLine('> Terminal cleared.', 'system');
    }

    cmdDate() {
        const now = new Date();
        const nightCityTime = new Date(now.getTime() + (14 * 60 * 60 * 1000)); // UTC+14 approx
        this.printLine(`> System Time: ${nightCityTime.toISOString().replace('T', ' ').slice(0, 19)} NST`, 'info');
        this.printLine(`> Local Time: ${now.toLocaleString()}`, 'system');
    }

    cmdEcho(args) {
        this.printLine(`> ${args.join(' ')}`, 'info');
    }

    cmdWhoami() {
        this.printRaw(`
<div class="command-output">
    <p>You are: <span class="info">RUNNER (Unverified)</span></p>
    <p>Clearance: <span class="warning">LEVEL 0</span></p>
    <p>Session: <span class="success">ENCRYPTED</span></p>
    <br>
    <p>Complete ICE Breaker training to increase clearance level.</p>
</div>`);
    }

    cmdStatus() {
        this.printRaw(`
<div class="command-output">
    <h4>// SYSTEM STATUS</h4>
    <p>Network Connection: <span class="success">ONLINE</span></p>
    <p>Encryption: <span class="success">ACTIVE (AES-4096)</span></p>
    <p>Trace Protection: <span class="success">ACTIVE</span></p>
    <p>ICE Status: <span class="success">ALL SYSTEMS NOMINAL</span></p>
    <p>Active Runners: <span class="info">47</span></p>
    <p>Safe Houses: <span class="info">12</span></p>
</div>`);
    }

    cmdNet() {
        this.printRaw(`
<div class="command-output">
    <h4>// NETWORK INFORMATION</h4>
    <p>Current Node: Watson_Northside_Relay_7</p>
    <p>Uplink Speed: 10.77 TB/s</p>
    <p>Ping: 0.003ms</p>
    <p>Route: [REDACTED] -> [REDACTED] -> ZERO_COOL_CORE</p>
    <br>
    <p class="warning">⚠️ Deep net access requires Level 3+ clearance</p>
</div>`);
    }

    cmdCrew() {
        this.printRaw(`
<div class="command-output">
    <h4>// LEADERSHIP TRIAD</h4>
    <br>
    <div class="runner-card">
        <span class="name">ZERO</span>
        <span class="role"> // Founder</span>
        <div class="status">[MISSING - 2076]</div>
    </div>
    <div class="runner-card">
        <span class="name">GLITCH</span>
        <span class="role"> // Field Commander</span>
        <div class="status active">[ACTIVE]</div>
    </div>
    <div class="runner-card">
        <span class="name">MOONSHADOW</span>
        <span class="role"> // Tech/Intel</span>
        <div class="status active">[ACTIVE]</div>
    </div>
</div>`);
    }

    cmdSecret(args) {
        if (localStorage.getItem('zc_ice_complete')) {
            this.printRaw(`
<div class="command-output">
    <h4>// SECRET CONTENT UNLOCKED</h4>
    <p class="success">Congratulations, runner. You've proven your skills.</p>
    <br>
    <p>You've gained access to the hidden channel:</p>
    <p class="info">echo_channel://blackwall深处</p>
    <br>
    <p class="warning">⚠️ This is not a drill. The following is eyes-only:</p>
    <br>
    <pre class="ascii-art">
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║   PROJECT: GHOSTWALKER - CLASSIFIED BRIEFING     ║
    ║                                                   ║
    ║   Subject: Human-AI Hybrid Integration            ║
    ║   Status: ACTIVE (Unconfirmed)                    ║
    ║   Location: Arasaka Tower, Floor 147+             ║
    ║                                                   ║
    ║   Zero was close. Too close.                      ║
    ║   He's not dead. He's... somewhere else.          ║
    ║                                                   ║
    ║   Find him. Before they complete the project.     ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
    </pre>
    <br>
    <p>More secrets will be revealed as you progress...</p>
</div>`);
        } else {
            this.printRaw(`
<div class="command-output">
    <h4>// ACCESS DENIED</h4>
    <p class="error">Clearance Level Insufficient</p>
    <br>
    <p>This content requires Level 1 clearance.</p>
    <p>Complete ICE Breaker training (Level 3+) to unlock.</p>
    <br>
    <p>Access: <a href="hack-game.html" style="color: var(--neon-cyan);">hack-game.html</a></p>
</div>`);
        }
    }
}

// Initialize terminal
let terminal;
document.addEventListener('DOMContentLoaded', () => {
    terminal = new SecureTerminal();
    terminal.input.focus();
});

// Console message
console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║   ZERO_COOL // Secure Terminal                    ║
    ║                                                   ║
    ║   Pro tip: Type 'secret' after completing         ║
    ║   the ICE Breaker game for hidden content.        ║
    ╚═══════════════════════════════════════════════════╝
`);
