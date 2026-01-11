/**
 * Runtime Test Suite for Acode Plugin
 * Tests execute at plugin initialization and print results to terminal
 */

// ANSI color codes for terminal output
const COLORS = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    DIM: '\x1b[2m',
    ITALIC: '\x1b[3m',

    // Foreground colors
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    GRAY: '\x1b[90m',

    // Background colors
    BG_RED: '\x1b[41m',
    BG_GREEN: '\x1b[42m',
    BG_YELLOW: '\x1b[43m',
    BG_BLUE: '\x1b[44m',
};

// Spinner frames
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

class TestRunner {
    constructor(name = 'Test Suite') {
        this.name = name;
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }

    /**
     * Register a test
     */
    test(testName, testFn) {
        this.tests.push({ name: testName, fn: testFn });
    }

    /**
     * Assertions
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    /**
     * Run all tests
     */
    async run(writeOutput) {
        const line = (text = '', color = '') => {
            writeOutput(`${color}${text}${COLORS.RESET}\n`);
        };

        // Header
        line();
        line('╔════════════════════════════════════════════╗', COLORS.CYAN + COLORS.BRIGHT);
        line(`║ 🧪  ${this._padCenter(this.name, 35)} │`, COLORS.CYAN + COLORS.BRIGHT);
        line('╚════════════════════════════════════════════╝', COLORS.CYAN + COLORS.BRIGHT);
        line();

        // Run tests with spinner
        for (const test of this.tests) {
            let spinnerIndex = 0;
            let active = true;

            const spinner = setInterval(() => {
                if (!active) return;
                const frame = SPINNER_FRAMES[spinnerIndex++ % SPINNER_FRAMES.length];
                writeOutput(
                    `\r  ${COLORS.CYAN}${frame}${COLORS.RESET} Running ${test.name}...`
                );
            }, 80);

            try {
                await test.fn(this);

                active = false;
                clearInterval(spinner);
                writeOutput('\r\x1b[K');

                this.passed++;
                this.results.push({ name: test.name, status: 'PASS', error: null });
                line(`  ${COLORS.GREEN}✓${COLORS.RESET} ${test.name}`, COLORS.GREEN);

            } catch (error) {
                active = false;
                clearInterval(spinner);
                writeOutput('\r\x1b[K');

                this.failed++;
                this.results.push({ name: test.name, status: 'FAIL', error: error.message });
                line(`  ${COLORS.RED}✗${COLORS.RESET} ${test.name}`, COLORS.RED + COLORS.BRIGHT);
                line(`     ${COLORS.DIM}└─ ${error.message}${COLORS.RESET}`, COLORS.RED + COLORS.DIM);
            }
        }

        // Summary
        line();
        line('─────────────────────────────────────────────', COLORS.GRAY);

        const total = this.tests.length;
        const percentage = total
            ? ((this.passed / total) * 100).toFixed(1)
            : '0.0';

        const statusColor = this.failed === 0 ? COLORS.GREEN : COLORS.YELLOW;

        line(
            `  Tests: ${COLORS.BRIGHT}${total}${COLORS.RESET} | ` +
            `${statusColor}Passed: ${this.passed}${COLORS.RESET} | ` +
            `${COLORS.RED}Failed: ${this.failed}${COLORS.RESET}`,
            statusColor
        );

        line(`  Success Rate: ${statusColor}${percentage}%${COLORS.RESET}`, statusColor);
        line('─────────────────────────────────────────────', COLORS.GRAY);
        line();

        return this.results;
    }

    /**
     * Center text helper
     */
    _padCenter(text, width) {
        const pad = Math.max(0, width - text.length);
        return ' '.repeat(Math.floor(pad / 2)) +
            text +
            ' '.repeat(Math.ceil(pad / 2));
    }
}

export { TestRunner };
