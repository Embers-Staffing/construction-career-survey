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
        selectMBTIPreference('mbtiEI', 'E');  // Extrovert
        selectMBTIPreference('mbtiSN', 'N');  // Intuitive
        selectMBTIPreference('mbtiTF', 'F');  // Feeling
        selectMBTIPreference('mbtiJP', 'J');  // Judging

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

        // Select technical skills
        const technicalSkills = [
            'hand-power-tools',
            'blueprint-reading',
            'construction-math',
            'safety-procedures',
            'heavy-equipment',
            'computer-software'
        ];
        technicalSkills.forEach(skill => {
            const checkbox = document.querySelector(`input[name="technicalSkills"][value="${skill}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                DEBUG.error(`Technical skill checkbox not found: ${skill}`);
            }
        });

        // Select certifications
        const certificationSelect = document.querySelector('select[name="certifications"]');
        if (certificationSelect) {
            certificationSelect.value = 'osha-30';  // Example certification
        } else {
            DEBUG.error('Certifications select not found');
        }

        // Select career interests (max 3)
        const careerInterests = ['trades', 'tech-specialist', 'project-management'];
        careerInterests.forEach(interest => {
            const checkbox = document.querySelector(`input[name="careerInterests"][value="${interest}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                DEBUG.error(`Career interest checkbox not found: ${interest}`);
            }
        });

        // Select tech interests
        const techInterests = ['drones', 'bim', 'ai'];
        techInterests.forEach(tech => {
            const checkbox = document.querySelector(`input[name="techInterests"][value="${tech}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                DEBUG.error(`Tech interest checkbox not found: ${tech}`);
            }
        });

        // Select work environment
        const envRadio = document.querySelector('input[name="environmentComfort"][value="mixed"]');
        if (envRadio) {
            envRadio.checked = true;
        } else {
            DEBUG.error('Environment comfort radio not found');
        }

        // Select travel willingness
        const travelSelect = document.getElementById('travelWillingness');
        if (travelSelect) {
            travelSelect.value = 'occasional';
        } else {
            DEBUG.error('Travel willingness select not found');
        }

        // Select career goals
        const careerGoals = ['leadership', 'specialist', 'innovation'];
        careerGoals.forEach(goal => {
            const checkbox = document.querySelector(`input[name="careerGoals"][value="${goal}"]`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                DEBUG.error(`Career goal checkbox not found: ${goal}`);
            }
        });

        // Select advancement preference
        const advancementRadio = document.querySelector('input[name="advancementPreference"][value="both"]');
        if (advancementRadio) {
            advancementRadio.checked = true;
        } else {
            DEBUG.error('Advancement preference radio not found');
        }

        // Select mentorship type
        const mentorshipSelect = document.getElementById('mentorshipType');
        if (mentorshipSelect) {
            mentorshipSelect.value = 'industry';
        } else {
            DEBUG.error('Mentorship type select not found');
        }

        // Select salary target
        const salarySelect = document.getElementById('salaryTarget');
        if (salarySelect) {
            salarySelect.value = '80-100k';
        } else {
            DEBUG.error('Salary target select not found');
        }

        // Submit the form
        const form = document.getElementById('careerForm');
        if (form) {
            DEBUG.info('Submitting form');
            // Create and dispatch both events to ensure proper form validation
            form.dispatchEvent(new Event('submit', { cancelable: true }));
            
            // Show the results section
            const resultsDiv = document.getElementById('results');
            if (resultsDiv) {
                resultsDiv.style.display = 'block';
            }
        } else {
            DEBUG.error('Form not found');
        }

    } catch (error) {
        DEBUG.error('Error during auto-fill:', error);
    }
}

/**
 * Helper function to select MBTI preference
 * @param {string} name - The name of the MBTI radio group (e.g., 'mbtiEI')
 * @param {string} value - The value to select (e.g., 'E')
 */
function selectMBTIPreference(name, value) {
    const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
    } else {
        DEBUG.error(`MBTI radio button not found: ${name}-${value}`);
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
