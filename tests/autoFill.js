'use strict';

// Debug utility
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

/**
 * Auto-fill the career survey form with test data
 */
function autoFillSurvey() {
    DEBUG.info('Starting auto-fill process');

    try {
        // Fill out personal information
        document.getElementById('firstName').value = 'Test';
        document.getElementById('lastName').value = 'User';
        document.getElementById('birthYear').value = '1990';
        document.getElementById('birthMonth').value = '6';
        document.getElementById('constructionExperience').value = '3';

        // Select MBTI preferences
        selectMBTIPreference('E', 'I');  // Extrovert
        selectMBTIPreference('N', 'S');  // Intuitive
        selectMBTIPreference('F', 'T');  // Feeling
        selectMBTIPreference('J', 'P');  // Judging

        // Select Holland Code interests (max 3)
        const hollandCodes = ['realistic', 'investigative', 'social'];
        hollandCodes.forEach(code => {
            const checkbox = document.querySelector(`input[name="hollandCode"][value="${code}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                DEBUG.error(`Holland code checkbox not found: ${code}`);
            }
        });

        // Select work environment
        document.querySelector('input[name="environmentComfort"][value="outdoor"]').checked = true;

        // Select physical requirements
        document.querySelector('input[name="physicalComfort"][value="moderate"]').checked = true;

        // Select travel preferences
        document.querySelector('input[name="travelPreference"][value="occasional"]').checked = true;

        // Fill out career goals
        const goalsTextarea = document.getElementById('careerGoals');
        if (goalsTextarea) {
            goalsTextarea.value = 'Looking to advance in construction management and gain technical expertise.';
        }

        // Select professional development preferences
        const devPreferences = ['certification', 'mentorship', 'workshops'];
        devPreferences.forEach(pref => {
            const checkbox = document.getElementById(`development-${pref}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        // Submit the form
        const form = document.getElementById('careerForm');
        if (form) {
            DEBUG.info('Submitting form');
            form.dispatchEvent(new Event('submit'));
        } else {
            DEBUG.error('Form not found');
        }

    } catch (error) {
        DEBUG.error('Error during auto-fill:', error);
    }
}

/**
 * Helper function to select MBTI preference
 * @param {string} preference - The preference to select (e.g., 'E' for Extrovert)
 * @param {string} opposite - The opposite preference (e.g., 'I' for Introvert)
 */
function selectMBTIPreference(preference, opposite) {
    const radio = document.querySelector(`input[name="mbti-${preference.toLowerCase()}${opposite.toLowerCase()}"][value="${preference}"]`);
    if (radio) {
        radio.checked = true;
    } else {
        DEBUG.error(`MBTI radio button not found: mbti-${preference.toLowerCase()}${opposite.toLowerCase()}`);
    }
}

// Add a button to trigger the auto-fill
function addAutoFillButton() {
    // Only add the button in development or on GitHub Pages preview
    if (!(window.location.hostname === 'localhost' || 
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === 'embers-staffing.github.io')) {
        return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary mb-3';
    button.innerHTML = '<i class="fas fa-robot me-2"></i>Auto-Fill Test Data';
    button.onclick = autoFillSurvey;

    const form = document.getElementById('careerForm');
    if (form) {
        form.insertBefore(button, form.firstChild);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', addAutoFillButton);

// Export functions for use in other modules
export { autoFillSurvey, addAutoFillButton };
