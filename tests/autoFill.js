'use strict';

/**
 * Auto-fills the career survey form with test data and submits it
 * @returns {Promise<void>}
 */
async function autoFillSurvey() {
    console.log('Starting auto-fill test...');

    try {
        // Personal Information
        document.getElementById('firstName').value = 'Test';
        document.getElementById('lastName').value = 'User';
        
        // Birth Year and Month
        const birthYear = document.getElementById('birthYear');
        birthYear.value = '1990';
        const birthMonth = document.getElementById('birthMonth');
        birthMonth.value = '6';

        // MBTI Assessment
        const mbtiOptions = {
            'ei': 'E', // Extraversion
            'sn': 'S', // Sensing
            'tf': 'T', // Thinking
            'jp': 'J'  // Judging
        };

        Object.entries(mbtiOptions).forEach(([dimension, preference]) => {
            const radio = document.querySelector(`input[name="mbti-${dimension}"][value="${preference}"]`);
            if (radio) radio.checked = true;
        });

        // Holland Code Assessment (max 3)
        const hollandCodes = ['realistic', 'investigative', 'conventional'];
        hollandCodes.forEach(code => {
            const checkbox = document.getElementById(`hollandCode-${code}`);
            if (checkbox) checkbox.checked = true;
        });

        // Skills Assessment
        const skills = ['projectManagement', 'teamLeadership', 'technicalKnowledge'];
        skills.forEach(skill => {
            const radio = document.querySelector(`input[name="skill-${skill}"][value="4"]`); // Select "Advanced"
            if (radio) radio.checked = true;
        });

        // Experience Level
        document.querySelector('input[name="experienceLevel"][value="intermediate"]').checked = true;

        // Preferred Roles (max 3)
        const roles = ['projectManager', 'superintendent', 'estimator'];
        roles.forEach(role => {
            const checkbox = document.getElementById(`role-${role}`);
            if (checkbox) checkbox.checked = true;
        });

        // Work Environment
        document.querySelector('input[name="environmentComfort"][value="both"]').checked = true;

        // Physical Requirements
        document.querySelector('input[name="physicalComfort"][value="moderate"]').checked = true;

        // Travel Preferences
        document.querySelector('input[name="travelPreference"][value="occasional"]').checked = true;

        // Career Goals
        const goalsTextarea = document.getElementById('careerGoals');
        if (goalsTextarea) {
            goalsTextarea.value = 'Looking to advance in construction management and gain technical expertise.';
        }

        // Professional Development
        const devPreferences = ['certification', 'mentorship', 'workshops'];
        devPreferences.forEach(pref => {
            const checkbox = document.getElementById(`development-${pref}`);
            if (checkbox) checkbox.checked = true;
        });

        // Submit the form
        console.log('Form filled, submitting...');
        const form = document.getElementById('careerForm');
        if (form) {
            const submitEvent = new Event('submit', { cancelable: true });
            form.dispatchEvent(submitEvent);
            console.log('Form submitted successfully');
        } else {
            console.error('Form not found');
        }

    } catch (error) {
        console.error('Error during auto-fill:', error);
    }
}

// Add a button to trigger the auto-fill
function addAutoFillButton() {
    const button = document.createElement('button');
    button.textContent = 'Auto-Fill Test';
    button.className = 'btn btn-secondary position-fixed top-0 end-0 m-3';
    button.style.zIndex = '1000';
    button.onclick = autoFillSurvey;
    document.body.appendChild(button);
}

// Export functions
export { autoFillSurvey, addAutoFillButton };
