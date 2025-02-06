/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
const assert = require('assert');

// Mock functions for external dependencies
const mockRecommendations = [
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

describe('Form Mode Functional Tests', () => {
    beforeEach(() => {
        // Set up document body
        document.body.innerHTML = `
            <div class="container">
                <div class="form-controls">
                    <label for="fillModeToggle">Auto-Fill Mode</label>
                    <input type="checkbox" id="fillModeToggle">
                </div>

                <form id="careerForm">
                    <div id="personal" class="section">
                        <h2>Personal Information</h2>
                        <input type="text" name="name" placeholder="Full Name" required>
                        <select name="age" required>
                            <option value="">Select Age</option>
                            ${Array.from({length: 50}, (_, i) => i + 16).map(age => 
                                `<option value="${age}">${age}</option>`
                            ).join('')}
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
        `;

        // Mock external functions
        window.getRecommendations = jest.fn().mockResolvedValue(mockRecommendations);
        window.autoFillSurvey = jest.fn().mockImplementation(() => {
            const form = document.getElementById('careerForm');
            form.querySelector('[name="name"]').value = 'John Doe';
            form.querySelector('[name="age"]').value = '25';
            form.querySelector('[name="mbti"]').value = 'ISTJ';
            form.querySelector('[name="holland"]').value = 'RIA';
            form.querySelector('[name="skills"]').value = 'Project management, Leadership';
            form.querySelector('[name="workStyle"]').value = 'management';
            form.querySelector('[name="goals"]').value = 'Become a construction manager';
            return Promise.resolve();
        });
        window.showNotification = jest.fn();
        window.DEBUG = {
            info: jest.fn(),
            error: jest.fn()
        };

        // Initialize form controls
        window.CONFIG = {
            MIN_AGE: 16,
            MAX_AGE: 65,
            AUTO_FILL_MODE: false
        };

        // Add form mode functionality
        require('../../script.js');
    });

    test('complete form submission workflow with auto-fill', async () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const form = document.getElementById('careerForm');
        const results = document.getElementById('results');

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify form is filled automatically
        assert.strictEqual(form.querySelector('[name="name"]').value, 'John Doe');
        assert.strictEqual(form.querySelector('[name="age"]').value, '25');
        assert.strictEqual(form.querySelector('[name="mbti"]').value, 'ISTJ');
        assert.strictEqual(form.querySelector('[name="holland"]').value, 'RIA');
        assert.strictEqual(form.querySelector('[name="workStyle"]').value, 'management');

        // Submit form
        fireEvent.submit(form);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify recommendations are displayed
        assert.strictEqual(results.style.display, 'block');
        assert(window.getRecommendations.mock.calls.length > 0);

        // Verify notification
        assert(window.showNotification.mock.calls.some(call => 
            call[0].includes('recommendations') && call[1] === 'success'
        ));
    });

    test('form validation in manual mode', async () => {
        const form = document.getElementById('careerForm');
        const nameInput = form.querySelector('[name="name"]');
        const ageSelect = form.querySelector('[name="age"]');

        // Try to submit empty form
        fireEvent.submit(form);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify form validation
        assert.strictEqual(nameInput.validity.valid, false);
        assert.strictEqual(ageSelect.validity.valid, false);

        // Fill required fields
        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        fireEvent.change(ageSelect, { target: { value: '30' } });

        // Verify validation state
        assert.strictEqual(nameInput.validity.valid, true);
        assert.strictEqual(ageSelect.validity.valid, true);
    });

    test('auto-fill error handling', async () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        
        // Mock auto-fill to fail
        window.autoFillSurvey.mockRejectedValueOnce(new Error('Network error'));

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify error handling
        assert(window.DEBUG.error.mock.calls.length > 0);
        assert(window.showNotification.mock.calls.some(call => 
            call[0].includes('Error auto-filling form') && call[1] === 'error'
        ));

        // Verify form is usable
        const inputs = document.querySelectorAll('#careerForm input:not(#fillModeToggle)');
        inputs.forEach(input => {
            assert.strictEqual(input.disabled, false);
        });
    });

    test('form state preservation during mode switches', async () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const form = document.getElementById('careerForm');
        
        // Fill form manually
        const inputs = {
            name: 'Jane Doe',
            age: '30',
            mbti: 'ENFP',
            holland: 'ASE',
            skills: 'Leadership, Communication',
            workStyle: 'management',
            goals: 'Lead construction projects'
        };

        Object.entries(inputs).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            fireEvent.change(input, { target: { value } });
        });

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify form values are preserved
        Object.entries(inputs).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            assert.strictEqual(input.value, value);
        });

        // Disable auto-fill mode
        fireEvent.click(fillModeToggle);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify form is reset
        Object.entries(inputs).forEach(([name]) => {
            const input = form.querySelector(`[name="${name}"]`);
            assert.strictEqual(input.value, '');
        });
    });

    test('accessibility in both modes', () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const form = document.getElementById('careerForm');
        
        // Check initial state
        assert.strictEqual(fillModeToggle.getAttribute('aria-label'), 'Enable auto-fill mode');
        
        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);
        
        // Verify form inputs are properly disabled
        form.querySelectorAll('input:not(#fillModeToggle), select, textarea').forEach(input => {
            assert.strictEqual(input.disabled, true);
            assert.strictEqual(input.getAttribute('aria-disabled'), 'true');
        });
        
        // Disable auto-fill mode
        fireEvent.click(fillModeToggle);
        
        // Verify form inputs are properly enabled
        form.querySelectorAll('input:not(#fillModeToggle), select, textarea').forEach(input => {
            assert.strictEqual(input.disabled, false);
            assert(input.getAttribute('aria-disabled') === null);
        });
    });
});
