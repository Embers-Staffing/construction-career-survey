/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
const assert = require('assert');

// Mock functions
const autoFillSurvey = jest.fn();
const showNotification = jest.fn();
const DEBUG = {
    info: jest.fn(),
    error: jest.fn()
};

describe('Form Mode Integration', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Set up document body with minimal HTML structure
        document.body.innerHTML = `
            <form id="careerForm">
                <input type="checkbox" id="fillModeToggle">
                <div id="personal">
                    <input type="text" name="name" required>
                    <select name="age" required>
                        <option value="">Select Age</option>
                        <option value="25">25</option>
                    </select>
                </div>
                <div id="personality">
                    <input type="text" name="mbti" required>
                </div>
                <div id="skills">
                    <input type="text" name="skills" required>
                </div>
                <div id="preferences">
                    <input type="text" name="preferences" required>
                </div>
                <div id="goals">
                    <input type="text" name="goals" required>
                </div>
                <button type="submit">Submit</button>
            </form>
            <div id="results" style="display: none;"></div>
        `;

        // Add form mode functionality
        window.CONFIG = {
            MIN_AGE: 16,
            MAX_AGE: 65,
            AUTO_FILL_MODE: false
        };

        window.autoFillSurvey = autoFillSurvey;
        window.showNotification = showNotification;
        window.DEBUG = DEBUG;

        window.initializeFillModeControls = function() {
            const fillModeToggle = document.getElementById('fillModeToggle');
            const form = document.getElementById('careerForm');
            
            CONFIG.AUTO_FILL_MODE = fillModeToggle.checked;
            updateFormMode();
            
            fillModeToggle.addEventListener('change', async (event) => {
                CONFIG.AUTO_FILL_MODE = event.target.checked;
                
                if (CONFIG.AUTO_FILL_MODE) {
                    try {
                        DEBUG.info('Auto-filling form');
                        await autoFillSurvey();
                        updateFormMode();
                    } catch (error) {
                        DEBUG.error('Error auto-filling form:', error);
                        showNotification('Error auto-filling form. Please try again or fill manually.', 'error');
                    }
                } else {
                    form.reset();
                    updateFormMode();
                }
            });
        };

        window.updateFormMode = function() {
            const form = document.getElementById('careerForm');
            const inputs = form.querySelectorAll('input:not(#fillModeToggle), select, textarea');
            
            if (CONFIG.AUTO_FILL_MODE) {
                inputs.forEach(input => {
                    input.setAttribute('data-original-required', input.required);
                    input.required = false;
                    input.disabled = true;
                });
                
                showNotification('Auto-fill mode enabled. Form will be filled automatically.', 'info');
            } else {
                inputs.forEach(input => {
                    const originalRequired = input.getAttribute('data-original-required');
                    if (originalRequired !== null) {
                        input.required = originalRequired === 'true';
                    }
                    input.disabled = false;
                });
                
                showNotification('Manual fill mode enabled. Please fill out the form manually.', 'info');
            }
        };

        // Initialize form mode controls
        window.initializeFillModeControls();
    });

    test('should properly integrate with career form sections', () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const personalSection = document.querySelector('#personal input');
        const personalitySection = document.querySelector('#personality input');
        const skillsSection = document.querySelector('#skills input');
        const preferencesSection = document.querySelector('#preferences input');
        const goalsSection = document.querySelector('#goals input');

        // Verify all sections are initially enabled
        [personalSection, personalitySection, skillsSection, preferencesSection, goalsSection].forEach(input => {
            assert.strictEqual(input.disabled, false);
        });

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);

        // Verify all sections are disabled
        [personalSection, personalitySection, skillsSection, preferencesSection, goalsSection].forEach(input => {
            assert.strictEqual(input.disabled, true);
        });
    });

    test('should maintain form state across mode switches', async () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const nameInput = document.querySelector('input[name="name"]');
        const ageSelect = document.querySelector('select[name="age"]');

        // Fill some form fields
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(ageSelect, { target: { value: '25' } });

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);

        // Verify form values are preserved
        assert.strictEqual(nameInput.value, 'John Doe');
        assert.strictEqual(ageSelect.value, '25');

        // Disable auto-fill mode
        fireEvent.click(fillModeToggle);

        // Verify form is reset
        assert.strictEqual(nameInput.value, '');
        assert.strictEqual(ageSelect.value, '');
    });

    test('should integrate with form validation', async () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const form = document.getElementById('careerForm');
        const submitButton = form.querySelector('button[type="submit"]');

        // Try to submit empty form
        fireEvent.click(submitButton);
        
        // Verify form validation prevents submission
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            assert.strictEqual(field.validity.valid, false);
        });

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);

        // Verify required fields are not marked as invalid in auto-fill mode
        requiredFields.forEach(field => {
            assert.strictEqual(field.required, false);
        });
    });

    test('should handle network errors during auto-fill', async () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        
        // Mock auto-fill to fail
        autoFillSurvey.mockRejectedValueOnce(new Error('Network error'));

        // Enable auto-fill mode
        fireEvent.click(fillModeToggle);

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify error handling
        assert(DEBUG.error.mock.calls.length > 0);
        assert.deepStrictEqual(showNotification.mock.calls[1], [
            'Error auto-filling form. Please try again or fill manually.',
            'error'
        ]);

        // Verify form is still usable
        const inputs = document.querySelectorAll('#careerForm input:not(#fillModeToggle)');
        inputs.forEach(input => {
            assert.strictEqual(input.disabled, false);
        });
    });
});
