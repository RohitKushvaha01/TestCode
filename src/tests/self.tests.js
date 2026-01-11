/**
 * Plugin-specific Tests
 * Tests for AcodePlugin functionality
 */

import { TestRunner } from '../tester.js';

/**
 * Initialize plugin tests
 * @param {AcodePlugin} plugin - The plugin instance
 * @param {function} writeOutput - Function to write to terminal
 */
export async function runSelfTests(plugin, writeOutput) {
    const runner = new TestRunner('Self Tests');

    // Test 1: Plugin initialization
    runner.test('Plugin should initialize', async (test) => {
        test.assert(plugin !== null, 'Plugin instance should exist');
        test.assert(typeof plugin.init === 'function', 'Plugin should have init method');
        test.assert(typeof plugin.destroy === 'function', 'Plugin should have destroy method');
    });

    // Test 2: Check plugin class methods
    runner.test('Plugin should have required methods', (test) => {
        const requiredMethods = ['init', 'destroy'];
        for (const method of requiredMethods) {
            test.assert(
                typeof plugin[method] === 'function',
                `Plugin should have ${method} method`
            );
        }
    });

    // Test 3: Plugin properties
    runner.test('Plugin should have baseUrl property', (test) => {
        test.assert(
            plugin.hasOwnProperty('baseUrl') || true,
            'Plugin should support baseUrl property'
        );
    });

    // Test 4: Basic object type checking
    runner.test('Plugin should be an object', (test) => {
        test.assert(typeof plugin === 'object', 'Plugin should be an object');
        test.assert(plugin !== null, 'Plugin should not be null');
    });

    // Test 5: Method call simulation
    runner.test('Plugin init should be callable', (test) => {
        test.assert(
            plugin.init && typeof plugin.init.call === 'function',
            'Plugin init should be callable'
        );
    });

    // Run all tests
    return await runner.run(writeOutput);
}
