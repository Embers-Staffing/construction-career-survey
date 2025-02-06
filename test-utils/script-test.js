'use strict';

// Mock data functions
const getRecommendations = async () => [
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

const getCareerInfo = async (title) => ({
    title,
    description: 'Mock career description',
    requirements: ['Mock requirement'],
    salary: 'Mock salary range'
});

// Form validation
window.validateForm = function(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalid = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
        } else {
            field.classList.remove('invalid');
        }
    });

    if (firstInvalid) {
        firstInvalid.focus();
    }

    return isValid;
};

// Form mode functionality
function initializeFillModeControls() {
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
                CONFIG.AUTO_FILL_MODE = false;
                fillModeToggle.checked = false;
                updateFormMode();
            }
        } else {
            form.reset();
            updateFormMode();
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Check form validity
        if (!window.validateForm(form)) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const recommendations = await getRecommendations();
            const resultsDiv = document.getElementById('results');
            const recommendationsDiv = document.getElementById('recommendations');

            // Display recommendations
            recommendationsDiv.innerHTML = recommendations.map(rec => `
                <div class="recommendation">
                    <h3>${rec.title}</h3>
                    <p>${rec.description}</p>
                    <ul>
                        ${rec.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                    <p>Salary Range: ${rec.salary}</p>
                </div>
            `).join('');

            resultsDiv.style.display = 'block';
            showNotification('Here are your career recommendations!', 'success');
        } catch (error) {
            DEBUG.error('Error getting recommendations:', error);
            showNotification('Error getting recommendations. Please try again.', 'error');
        }
    });

    // Add input validation on blur
    form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('blur', () => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
            }
        });

        field.addEventListener('input', () => {
            if (field.value.trim()) {
                field.classList.remove('invalid');
            }
        });
    });
}

function updateFormMode() {
    const form = document.getElementById('careerForm');
    const inputs = form.querySelectorAll('input:not(#fillModeToggle), select, textarea');
    
    if (CONFIG.AUTO_FILL_MODE) {
        inputs.forEach(input => {
            input.setAttribute('data-original-required', input.required);
            input.required = false;
            input.disabled = true;
            input.setAttribute('aria-disabled', 'true');
        });
        
        showNotification('Auto-fill mode enabled. Form will be filled automatically.', 'info');
    } else {
        inputs.forEach(input => {
            const originalRequired = input.getAttribute('data-original-required');
            if (originalRequired !== null) {
                input.required = originalRequired === 'true';
            }
            input.disabled = false;
            input.removeAttribute('aria-disabled');
        });
        
        showNotification('Manual fill mode enabled. Please fill out the form manually.', 'info');
    }
}

// Initialize form controls
document.addEventListener('DOMContentLoaded', () => {
    initializeFillModeControls();
});
