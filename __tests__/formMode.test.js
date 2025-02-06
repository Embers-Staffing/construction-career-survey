/**
 * @jest-environment jsdom
 */

const jestDom = require('@testing-library/jest-dom');
const { fireEvent } = require('@testing-library/dom');

// Mock the functions we'll be testing
const mockFunctions = {
    initializeFillModeControls: () => {
        const fillModeToggle = document.getElementById('fillModeToggle');
        const form = document.getElementById('careerForm');
        
        // Initialize state
        window.CONFIG.AUTO_FILL_MODE = fillModeToggle.checked;
        mockFunctions.updateFormMode();
        
        // Handle toggle changes
        fillModeToggle.addEventListener('change', async (event) => {
            window.CONFIG.AUTO_FILL_MODE = event.target.checked;
            
            if (window.CONFIG.AUTO_FILL_MODE) {
                try {
                    window.DEBUG.info('Auto-filling form');
                    await window.autoFillSurvey();
                    mockFunctions.updateFormMode();
                } catch (error) {
                    window.DEBUG.error('Error auto-filling form:', error);
                    window.showNotification('Error auto-filling form. Please try again or fill manually.', 'error');
                }
            } else {
                form.reset();
                mockFunctions.updateFormMode();
            }
        });
    },

    updateFormMode: () => {
        const form = document.getElementById('careerForm');
        const inputs = form.querySelectorAll('input:not(#fillModeToggle), select, textarea');
        
        if (window.CONFIG.AUTO_FILL_MODE) {
            // Store original required state and disable inputs
            inputs.forEach(input => {
                input.setAttribute('data-original-required', input.required);
                input.required = false;
                input.disabled = true;
            });
            
            window.showNotification('Auto-fill mode enabled. Form will be filled automatically.', 'info');
        } else {
            // Restore original required state and enable inputs
            inputs.forEach(input => {
                const originalRequired = input.getAttribute('data-original-required');
                if (originalRequired !== null) {
                    input.required = originalRequired === 'true';
                }
                input.disabled = false;
            });
            
            window.showNotification('Manual fill mode enabled. Please fill out the form manually.', 'info');
        }
    }
};

// Mock the DOM environment
function setupDOM() {
    document.body.innerHTML = `
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="fillModeToggle">
            <label class="form-check-label" for="fillModeToggle">Auto-Fill Mode</label>
        </div>
        <form id="careerForm">
            <input type="text" name="name" required>
            <select name="age" required>
                <option value="">Choose...</option>
                <option value="20">20</option>
            </select>
            <textarea name="goals"></textarea>
        </form>
    `;
}

describe('Form Mode Controls', () => {
    beforeEach(() => {
        setupDOM();
        window.CONFIG = { AUTO_FILL_MODE: false };
        window.DEBUG = {
            info: jest.fn(),
            error: jest.fn()
        };
        window.showNotification = jest.fn();
        window.autoFillSurvey = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with manual mode by default', () => {
        mockFunctions.initializeFillModeControls();
        const toggle = document.getElementById('fillModeToggle');
        expect(toggle.checked).toBeFalsy();
        expect(window.CONFIG.AUTO_FILL_MODE).toBeFalsy();
    });

    test('should enable auto-fill mode when toggle is checked', async () => {
        mockFunctions.initializeFillModeControls();
        const toggle = document.getElementById('fillModeToggle');
        
        await fireEvent.click(toggle);
        
        expect(window.CONFIG.AUTO_FILL_MODE).toBeTruthy();
        expect(window.autoFillSurvey).toHaveBeenCalled();
        expect(window.showNotification).toHaveBeenCalledWith(
            'Auto-fill mode enabled. Form will be filled automatically.',
            'info'
        );
    });

    test('should disable form inputs in auto-fill mode', () => {
        window.CONFIG.AUTO_FILL_MODE = true;
        mockFunctions.updateFormMode();
        
        const inputs = document.querySelectorAll('input:not(#fillModeToggle), select, textarea');
        inputs.forEach(input => {
            expect(input.disabled).toBeTruthy();
            expect(input.required).toBeFalsy();
        });
    });

    test('should enable form inputs in manual mode', () => {
        window.CONFIG.AUTO_FILL_MODE = false;
        mockFunctions.updateFormMode();
        
        const inputs = document.querySelectorAll('input:not(#fillModeToggle), select, textarea');
        inputs.forEach(input => {
            expect(input.disabled).toBeFalsy();
        });
    });

    test('should preserve original required state when switching modes', () => {
        const nameInput = document.querySelector('input[name="name"]');
        const ageSelect = document.querySelector('select[name="age"]');
        const goalsTextarea = document.querySelector('textarea[name="goals"]');
        
        // Initial state (manual mode)
        expect(nameInput.required).toBeTruthy();
        expect(ageSelect.required).toBeTruthy();
        expect(goalsTextarea.required).toBeFalsy();
        
        // Switch to auto-fill mode
        window.CONFIG.AUTO_FILL_MODE = true;
        mockFunctions.updateFormMode();
        
        // Switch back to manual mode
        window.CONFIG.AUTO_FILL_MODE = false;
        mockFunctions.updateFormMode();
        
        // Check if required state is preserved
        expect(nameInput.required).toBeTruthy();
        expect(ageSelect.required).toBeTruthy();
        expect(goalsTextarea.required).toBeFalsy();
    });

    test('should handle auto-fill errors gracefully', async () => {
        window.autoFillSurvey.mockRejectedValueOnce(new Error('Auto-fill failed'));
        mockFunctions.initializeFillModeControls();
        const toggle = document.getElementById('fillModeToggle');
        
        await fireEvent.click(toggle);
        
        expect(window.DEBUG.error).toHaveBeenCalled();
        expect(window.showNotification).toHaveBeenCalledWith(
            'Error auto-filling form. Please try again or fill manually.',
            'error'
        );
    });
});
