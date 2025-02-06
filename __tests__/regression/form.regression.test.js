'use strict';

import { JSDOM } from 'jsdom';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Career Survey Form Regression Tests', () => {
    let dom;
    let document;
    let window;
    let form;
    let fillModeToggle;

    beforeEach(async () => {
        // Set up DOM environment
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Career Survey Form</title>
                <style>
                    .invalid { border-color: red; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="form-controls">
                        <label for="fillModeToggle">Auto-Fill Mode</label>
                        <input type="checkbox" id="fillModeToggle">
                    </div>

                    <form id="careerForm" novalidate>
                        <div id="personal" class="section">
                            <h2>Personal Information</h2>
                            <input type="text" name="name" placeholder="Full Name" required>
                            <select name="age" required>
                                <option value="">Select Age</option>
                                ${Array.from({length: 50}, (_, i) => i + 16)
                                    .map(age => `<option value="${age}">${age}</option>`)
                                    .join('')}
                            </select>
                        </div>

                        <div id="personality" class="section">
                            <h2>Personality Assessment</h2>
                            <div class="mbti-section">
                                <label>MBTI Type:</label>
                                <input type="text" name="mbti" required>
                            </div>
                            <div class="holland-section">
                                <label>Holland Codes:</label>
                                <input type="text" name="holland" required>
                            </div>
                        </div>

                        <div id="skills" class="section">
                            <h2>Skills & Experience</h2>
                            <textarea name="skills" required></textarea>
                        </div>

                        <div id="preferences" class="section">
                            <h2>Work Preferences</h2>
                            <select name="workStyle" required>
                                <option value="">Select Work Style</option>
                                <option value="hands-on">Hands-on</option>
                                <option value="management">Management</option>
                                <option value="technical">Technical</option>
                            </select>
                        </div>

                        <div id="goals" class="section">
                            <h2>Career Goals</h2>
                            <textarea name="goals" required></textarea>
                        </div>

                        <button type="submit">Get Recommendations</button>
                    </form>

                    <div id="results" style="display: none;">
                        <h2>Your Career Recommendations</h2>
                        <div id="recommendations"></div>
                    </div>

                    <div id="notification" class="notification" style="display: none;"></div>
                </div>
            </body>
            </html>
        `, {
            url: 'http://localhost',
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true
        });

        // Set up global environment
        window = dom.window;
        document = window.document;
        global.window = window;
        global.document = document;
        global.CustomEvent = window.CustomEvent;
        global.Event = window.Event;
        global.navigator = window.navigator;

        // Mock external functions
        window.getRecommendations = async () => [
            {
                title: 'Construction Manager',
                description: 'Manages construction projects',
                requirements: ['Bachelor\'s degree', '5 years experience'],
                salary: '$80,000 - $120,000'
            },
            {
                title: 'Site Supervisor',
                description: 'Supervises construction sites',
                requirements: ['Associate\'s degree', '3 years experience'],
                salary: '$60,000 - $90,000'
            }
        ];

        window.autoFillSurvey = async () => {
            const form = document.getElementById('careerForm');
            form.querySelector('[name="name"]').value = 'John Doe';
            form.querySelector('[name="age"]').value = '25';
            form.querySelector('[name="mbti"]').value = 'ISTJ';
            form.querySelector('[name="holland"]').value = 'RIA';
            form.querySelector('[name="skills"]').value = 'Project management, Leadership';
            form.querySelector('[name="workStyle"]').value = 'management';
            form.querySelector('[name="goals"]').value = 'Become a construction manager';
        };

        window.showNotification = (message, type) => {
            console.log(`Notification: ${message} (${type})`);
        };

        window.DEBUG = {
            info: console.log,
            error: console.error
        };

        window.CONFIG = {
            MIN_AGE: 16,
            MAX_AGE: 65,
            AUTO_FILL_MODE: false
        };

        // Load and execute script
        const scriptContent = fs.readFileSync(path.join(__dirname, '../../script.js'), 'utf8');
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);

        // Initialize form elements
        form = document.getElementById('careerForm');
        fillModeToggle = document.getElementById('fillModeToggle');

        // Trigger DOMContentLoaded
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    describe('Form Mode Controls', () => {
        it('should start in manual mode', () => {
            const inputs = form.querySelectorAll('input:not(#fillModeToggle), select, textarea');
            inputs.forEach(input => {
                assert(!input.disabled, 'Inputs should be enabled in manual mode');
            });
        });

        it('should switch to auto-fill mode when toggled', async () => {
            fillModeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            const inputs = form.querySelectorAll('input:not(#fillModeToggle), select, textarea');
            inputs.forEach(input => {
                assert(input.disabled, 'Inputs should be disabled in auto-fill mode');
            });
        });

        it('should preserve form data when switching modes', async () => {
            const testData = {
                name: 'Jane Doe',
                age: '30',
                mbti: 'ENFP',
                holland: 'ASE',
                skills: 'Leadership',
                workStyle: 'management',
                goals: 'Lead projects'
            };

            // Fill form
            Object.entries(testData).forEach(([name, value]) => {
                const input = form.querySelector(`[name="${name}"]`);
                input.value = value;
                input.dispatchEvent(new Event('input'));
            });

            // Switch modes
            fillModeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify data is preserved
            Object.entries(testData).forEach(([name, value]) => {
                const input = form.querySelector(`[name="${name}"]`);
                assert.strictEqual(input.value, value, `${name} value should be preserved`);
            });
        });
    });

    describe('Form Validation', () => {
        it('should mark empty required fields as invalid on blur', () => {
            const nameInput = form.querySelector('[name="name"]');
            nameInput.dispatchEvent(new Event('blur'));
            assert(nameInput.classList.contains('invalid'), 'Empty required field should be marked as invalid');
        });

        it('should remove invalid class when field is filled', () => {
            const nameInput = form.querySelector('[name="name"]');
            
            // First mark as invalid
            nameInput.dispatchEvent(new Event('blur'));
            assert(nameInput.classList.contains('invalid'), 'Field should start invalid');

            // Then fill and validate
            nameInput.value = 'John Doe';
            nameInput.dispatchEvent(new Event('input'));
            assert(!nameInput.classList.contains('invalid'), 'Field should not be invalid after filling');
        });

        it('should prevent submission with invalid fields', async () => {
            const submitEvent = new Event('submit', { cancelable: true });
            form.dispatchEvent(submitEvent);
            
            const results = document.getElementById('results');
            assert.strictEqual(results.style.display, 'none', 'Results should not be displayed with invalid form');
        });
    });

    describe('Form Submission', () => {
        beforeEach(async () => {
            // Fill all required fields
            const testData = {
                name: 'Jane Doe',
                age: '30',
                mbti: 'ENFP',
                holland: 'ASE',
                skills: 'Leadership',
                workStyle: 'management',
                goals: 'Lead projects'
            };

            Object.entries(testData).forEach(([name, value]) => {
                const input = form.querySelector(`[name="${name}"]`);
                input.value = value;
                input.dispatchEvent(new Event('input'));
            });
        });

        it('should display results after valid submission', async () => {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));

            const results = document.getElementById('results');
            assert.strictEqual(results.style.display, 'block', 'Results should be displayed after valid submission');
        });

        it('should render recommendations in results', async () => {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));

            const recommendations = document.querySelectorAll('.recommendation');
            assert(recommendations.length > 0, 'Recommendations should be rendered');
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully', async () => {
            // Mock API error
            window.getRecommendations = async () => {
                throw new Error('API Error');
            };

            // Fill form and submit
            await window.autoFillSurvey();
            form.dispatchEvent(new Event('submit', { cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));

            const results = document.getElementById('results');
            assert.strictEqual(results.style.display, 'none', 'Results should not be displayed on error');
        });

        it('should handle auto-fill errors gracefully', async () => {
            // Mock auto-fill error
            window.autoFillSurvey = async () => {
                throw new Error('Auto-fill Error');
            };

            fillModeToggle.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            assert(!fillModeToggle.checked, 'Toggle should be unchecked on auto-fill error');
            assert(!window.CONFIG.AUTO_FILL_MODE, 'Should revert to manual mode on auto-fill error');
        });
    });
});
