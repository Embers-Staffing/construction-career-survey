'use strict';

import { getRecommendations, getCareerDetails } from './data/career-data.js';

// Debug utilities
const DEBUG = {
    enabled: true,
    level: 'info',
    
    log(message, level = 'info', data = null) {
        if (!this.enabled) return;
        console.log(`[${level.toUpperCase()}] ${message}`, data || '');
    },
    
    error(message, error = null) {
        this.log(message, 'error', error);
    },
    
    info(message, data = null) {
        this.log(message, 'info', data);
    },
    
    debug(message, data = null) {
        this.log(message, 'debug', data);
    }
};

// Constants for configuration
const CONFIG = {
    MIN_AGE: 16,
    MAX_AGE: 70,
    MBTI_TYPES: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
};

// Career progression and salary data
const CAREER_DATA = {
    salaryRanges: {
        entry: {
            min: 45000,
            max: 65000,
            title: "Entry Level",
            experience: "0-2 years"
        },
        mid: {
            min: 65000,
            max: 95000,
            title: "Mid Level",
            experience: "2-5 years"
        },
        senior: {
            min: 95000,
            max: 150000,
            title: "Senior Level",
            experience: "5-10 years"
        },
        expert: {
            min: 150000,
            max: 250000,
            title: "Expert Level",
            experience: "10+ years"
        }
    }
};

function getCareerProgression(role, experience) {
    const progressionPaths = {
        "Project Manager": [
            { level: "Assistant Project Manager", years: "0-2", salary: CAREER_DATA.salaryRanges.entry },
            { level: "Project Manager", years: "2-5", salary: CAREER_DATA.salaryRanges.mid },
            { level: "Senior Project Manager", years: "5-10", salary: CAREER_DATA.salaryRanges.senior },
            { level: "Program Director", years: "10+", salary: CAREER_DATA.salaryRanges.expert }
        ],
        "Site Supervisor": [
            { level: "Assistant Supervisor", years: "0-2", salary: CAREER_DATA.salaryRanges.entry },
            { level: "Site Supervisor", years: "2-5", salary: CAREER_DATA.salaryRanges.mid },
            { level: "Senior Supervisor", years: "5-10", salary: CAREER_DATA.salaryRanges.senior },
            { level: "Operations Director", years: "10+", salary: CAREER_DATA.salaryRanges.expert }
        ],
        // Add more career paths as needed
    };

    const defaultPath = [
        { level: "Entry Level", years: "0-2", salary: CAREER_DATA.salaryRanges.entry },
        { level: "Mid Level", years: "2-5", salary: CAREER_DATA.salaryRanges.mid },
        { level: "Senior Level", years: "5-10", salary: CAREER_DATA.salaryRanges.senior },
        { level: "Expert Level", years: "10+", salary: CAREER_DATA.salaryRanges.expert }
    ];

    return progressionPaths[role] || defaultPath;
}

function getSalaryRange(careerPath) {
    const ranges = {
        'trades': '$45,000 - $95,000',
        'project-management': '$60,000 - $150,000',
        'tech-specialist': '$55,000 - $120,000',
        'estimator': '$50,000 - $110,000',
        'heavy-machinery': '$45,000 - $85,000'
    };
    return ranges[careerPath] || '$40,000 - $100,000';
}

function getRequiredSkills(careerPath) {
    const skills = {
        'trades': ['Technical Skills', 'Safety Knowledge', 'Physical Stamina', 'Problem Solving'],
        'project-management': ['Leadership', 'Communication', 'Planning', 'Budgeting'],
        'tech-specialist': ['Technical Knowledge', 'Computer Skills', 'Problem Solving', 'Innovation'],
        'estimator': ['Math Skills', 'Attention to Detail', 'Software Proficiency', 'Analysis'],
        'heavy-machinery': ['Equipment Operation', 'Safety Awareness', 'Mechanical Knowledge', 'Precision']
    };
    return skills[careerPath] || ['Basic Construction Knowledge', 'Communication', 'Teamwork'];
}

function getCareerGrowth(careerPath) {
    const growth = {
        'trades': 'Apprentice → Journeyman → Master → Business Owner',
        'project-management': 'Coordinator → Manager → Senior Manager → Director',
        'tech-specialist': 'Technician → Specialist → Lead → Technology Director',
        'estimator': 'Junior Estimator → Estimator → Senior Estimator → Chief Estimator',
        'heavy-machinery': 'Operator → Lead Operator → Site Supervisor → Operations Manager'
    };
    return growth[careerPath] || 'Entry Level → Mid Level → Senior Level → Leadership';
}

function getProgressionSteps(careerPath) {
    const progressions = {
        'trades': [
            {
                title: 'Apprentice',
                salary: '$35,000 - $45,000',
                timeframe: '1-2 years'
            },
            {
                title: 'Journeyman',
                salary: '$45,000 - $65,000',
                timeframe: '2-4 years'
            },
            {
                title: 'Master Tradesperson',
                salary: '$65,000 - $95,000',
                timeframe: '4-6 years'
            },
            {
                title: 'Trade Business Owner',
                salary: '$95,000+',
                timeframe: '6+ years'
            }
        ],
        'project-management': [
            {
                title: 'Project Coordinator',
                salary: '$45,000 - $60,000',
                timeframe: '0-2 years'
            },
            {
                title: 'Project Manager',
                salary: '$60,000 - $90,000',
                timeframe: '2-5 years'
            },
            {
                title: 'Senior Project Manager',
                salary: '$90,000 - $120,000',
                timeframe: '5-8 years'
            },
            {
                title: 'Construction Director',
                salary: '$120,000+',
                timeframe: '8+ years'
            }
        ],
        'tech-specialist': [
            {
                title: 'Construction Technologist',
                salary: '$45,000 - $60,000',
                timeframe: '0-2 years'
            },
            {
                title: 'BIM Specialist',
                salary: '$60,000 - $85,000',
                timeframe: '2-4 years'
            },
            {
                title: 'Technology Manager',
                salary: '$85,000 - $110,000',
                timeframe: '4-6 years'
            },
            {
                title: 'Digital Construction Director',
                salary: '$110,000+',
                timeframe: '6+ years'
            }
        ],
        'estimator': [
            {
                title: 'Junior Estimator',
                salary: '$45,000 - $65,000',
                timeframe: '0-2 years'
            },
            {
                title: 'Estimator',
                salary: '$65,000 - $85,000',
                timeframe: '2-4 years'
            },
            {
                title: 'Senior Estimator',
                salary: '$85,000 - $115,000',
                timeframe: '4-6 years'
            },
            {
                title: 'Chief Estimator',
                salary: '$115,000+',
                timeframe: '6+ years'
            }
        ],
        'heavy-machinery': [
            {
                title: 'Equipment Operator Trainee',
                salary: '$40,000 - $55,000',
                timeframe: '0-1 years'
            },
            {
                title: 'Equipment Operator',
                salary: '$55,000 - $75,000',
                timeframe: '1-3 years'
            },
            {
                title: 'Senior Operator',
                salary: '$75,000 - $95,000',
                timeframe: '3-5 years'
            },
            {
                title: 'Operations Supervisor',
                salary: '$95,000+',
                timeframe: '5+ years'
            }
        ]
    };
    
    return progressions[careerPath] || [
        {
            title: 'Entry Level',
            salary: '$40,000 - $50,000',
            timeframe: '0-2 years'
        },
        {
            title: 'Mid Level',
            salary: '$50,000 - $70,000',
            timeframe: '2-5 years'
        },
        {
            title: 'Senior Level',
            salary: '$70,000 - $100,000',
            timeframe: '5-8 years'
        },
        {
            title: 'Leadership',
            salary: '$100,000+',
            timeframe: '8+ years'
        }
    ];
}

function getNextSteps(result) {
    const steps = [];
    
    // Add basic steps based on experience level
    if (result.constructionExperience === 'none') {
        steps.push(
            "Research basic construction terminology and concepts",
            "Consider entry-level construction training programs",
            "Look into OSHA safety certifications",
            "Explore apprenticeship opportunities"
        );
    } else if (result.constructionExperience === 'beginner') {
        steps.push(
            "Pursue relevant certifications in your area of interest",
            "Join construction industry associations",
            "Build your professional network",
            "Consider specialized training programs"
        );
    } else {
        steps.push(
            "Look for leadership development opportunities",
            "Consider advanced certifications",
            "Explore mentorship opportunities",
            "Stay updated with industry innovations"
        );
    }

    // Add skill-based recommendations
    if (result.technicalSkills && result.technicalSkills.length > 0) {
        steps.push(`Build upon your existing skills: ${result.technicalSkills.join(', ')}`);
    }

    // Add technology-focused steps
    if (result.techInterests && result.techInterests.length > 0) {
        steps.push(`Explore training in: ${result.techInterests.join(', ')}`);
    }

    return steps;
}

async function displayResults(result, careerDetails) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';

    resultsDiv.innerHTML = `
        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">Career Matches</h3>
                <ul class="list-unstyled">
                    ${careerDetails.map(career => `<li>${career.title}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">Next Steps</h3>
                <ul class="list-unstyled">
                    ${getNextSteps(result).map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h3 class="card-title">Career Details</h3>
                ${careerDetails.map(career => `
                    <h4>${career.title}</h4>
                    <p>Salary Range: ${getSalaryRange(career.title)}</p>
                    <p>Required Skills: ${getRequiredSkills(career.title).join(', ')}</p>
                    <p>Career Growth: ${getCareerGrowth(career.title)}</p>
                    <p>Progression Steps:</p>
                    <ul class="list-unstyled">
                        ${getProgressionSteps(career.title).map(step => `<li>${step.title} - ${step.salary} - ${step.timeframe}</li>`).join('')}
                    </ul>
                `).join('')}
            </div>
        </div>
    `;
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function initializeForm() {
    const form = document.getElementById('careerForm');
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const hollandCodeCheckboxes = document.querySelectorAll('.holland-code');

    // Initialize years
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - CONFIG.MAX_AGE;
    const maxYear = currentYear - CONFIG.MIN_AGE;
    
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    for (let year = maxYear; year >= minYear; year--) {
        const option = document.createElement('option');
        option.value = year.toString(); // Ensure year is a string
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Initialize months
    monthSelect.innerHTML = '<option value="">Select Month</option>';
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month.toString(); // Ensure month is a string
        option.textContent = monthNames[month - 1];
        monthSelect.appendChild(option);
    }

    // Add event listener for Holland Code checkboxes
    hollandCodeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.holland-code:checked').length;
            if (checkedCount > 3) {
                this.checked = false;
                showNotification('Please select no more than 3 personality types.', 'warning');
            }
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after animation ends
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        DEBUG.info('Initializing application');
        initializeForm();

        // Get form elements
        const form = document.getElementById('careerForm');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                DEBUG.info('Form submitted, processing...');
                const formData = new FormData(form);
                
                // Get MBTI type from form data
                const mbtiType = getMBTIType(formData);
                DEBUG.info('MBTI Type:', mbtiType);

                // Get career recommendations
                const recommendations = getRecommendations(mbtiType);
                DEBUG.info('Career recommendations:', recommendations);

                if (recommendations && recommendations.length > 0) {
                    const result = {
                        mbtiType,
                        recommendations,
                        selectedCareer: recommendations[0]
                    };

                    // Get detailed information for the recommended careers
                    const careerDetails = recommendations.map(career => ({
                        title: career,
                        ...getCareerDetails(career)
                    }));

                    // Display results
                    displayResults(result, careerDetails);
                    
                    // Show success message
                    showNotification('Your career recommendations are ready!', 'success');
                } else {
                    showNotification('No recommendations found for your personality type.', 'warning');
                }
                
            } catch (error) {
                DEBUG.error('Error processing form:', error);
                showNotification('There was an error processing your information. Please try again.', 'error');
            }
        });

    } catch (error) {
        console.error('Initialization failed:', error);
    }
});

function getMBTIType(formData) {
    return (formData.get('mbtiEI') || '') +
           (formData.get('mbtiSN') || '') +
           (formData.get('mbtiTF') || '') +
           (formData.get('mbtiJP') || '');
}