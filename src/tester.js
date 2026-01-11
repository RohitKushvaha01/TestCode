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

class TestRunner {
    constructor(name = 'Test Suite') {
        this.name = name;
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }    /**
     * Register a test
     * @param {string} testName - Name of the test
     * @param {function} testFn - Test function that should return true if passed
     */
    test(testName, testFn) {
        this.tests.push({ name: testName, fn: testFn });
    }

    /**
     * Assert that a condition is true
     * @param {boolean} condition - Condition to test
     * @param {string} message - Message to display
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    /**
     * Assert equality
     * @param {*} actual - Actual value
     * @param {*} expected - Expected value
     * @param {string} message - Message to display
     */
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, but got ${actual}`);
        }
    }

    /**
     * Run all tests
     * @param {function} writeOutput - Function to write output to terminal
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

        // Run tests
        for (const test of this.tests) {
            try {
                await test.fn(this);
                this.passed++;
                this.results.push({ name: test.name, status: 'PASS', error: null });
                line(`  ${COLORS.GREEN}✓${COLORS.RESET} ${test.name}`, COLORS.GREEN);
            } catch (error) {
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
        const percentage = ((this.passed / total) * 100).toFixed(1);
        const passedColor = this.failed === 0 ? COLORS.GREEN : COLORS.YELLOW;

        line(`  Tests: ${COLORS.BRIGHT}${total}${COLORS.RESET} | ${passedColor}Passed: ${this.passed}${COLORS.RESET} | ${COLORS.RED}Failed: ${this.failed}${COLORS.RESET}`, passedColor);
        line(`  Success Rate: ${passedColor}${percentage}%${COLORS.RESET}`, passedColor);
        line('─────────────────────────────────────────────', COLORS.GRAY);
        line();

        return this.results;
    }

    /**
     * Helper function to center text
     * @private
     */
    _padCenter(text, width) {
        const totalPad = width - text.length;
        const leftPad = Math.floor(totalPad / 2);
        const rightPad = totalPad - leftPad;
        return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    }
}

export { TestRunner };
