'use strict';

import { careerRecommendationService } from './firebase.js';

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
    PROGRESS_INTERVAL: 200,
    PROGRESS_INCREMENT: 10
};

// Career progression and salary data
const CAREER_DATA = {
    trainingResources: {
        technical: [
            {
                name: "OSHA 30-Hour Construction Safety",
                provider: "OSHA Training Institute",
                duration: "30 hours",
                cost: "$189",
                level: "entry",
                url: "https://www.osha.com/courses/30-hour-construction"
            },
            {
                name: "Construction Project Management Fundamentals",
                provider: "Construction Management Association of America",
                duration: "40 hours",
                cost: "$599",
                level: "mid",
                url: "https://www.cmaanet.org/certification"
            },
            {
                name: "Blueprint Reading and Construction Drawings",
                provider: "American Institute of Constructors",
                duration: "20 hours",
                cost: "$299",
                level: "entry",
                url: "https://www.professionalconstructor.org/"
            }
        ],
        leadership: [
            {
                name: "Construction Leadership and Communication",
                provider: "Associated General Contractors",
                duration: "24 hours",
                cost: "$449",
                url: "https://www.agc.org/learn/education-training"
            },
            {
                name: "Team Management in Construction",
                provider: "Construction Management Association",
                duration: "16 hours",
                cost: "$349",
                url: "https://www.cmaanet.org/professional-development"
            }
        ],
        technology: [
            {
                name: "Building Information Modeling (BIM)",
                provider: "Autodesk",
                duration: "40 hours",
                cost: "$699",
                url: "https://www.autodesk.com/certification/construction"
            },
            {
                name: "Construction Technology and Innovation",
                provider: "Construction Industry Institute",
                duration: "32 hours",
                cost: "$549",
                url: "https://www.construction-institute.org/resources"
            },
            {
                name: "Digital Construction Tools",
                provider: "Associated Builders and Contractors",
                duration: "24 hours",
                cost: "$399",
                url: "https://www.abc.org/Education-Training"
            }
        ]
    },
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

async function getRecommendedTraining(role, experience) {
    try {
        const recommendations = await careerRecommendationService.getTrainingRecommendations(role, experience);
        
        if (!recommendations || recommendations.length === 0) {
            DEBUG.debug('No training recommendations found for:', { role, experience });
            return [];
        }

        // Group recommendations by category
        const groupedRecommendations = recommendations.reduce((acc, course) => {
            if (!acc[course.category]) {
                acc[course.category] = [];
            }
            acc[course.category].push(course);
            return acc;
        }, {});

        // Convert to array format
        return Object.entries(groupedRecommendations).map(([category, courses]) => ({
            category,
            courses
        }));
    } catch (error) {
        DEBUG.error('Error getting training recommendations:', error);
        return []; // Return empty array on error
    }
}

function calculateAge(birthYear, birthMonth) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based

    if (!birthYear || isNaN(birthYear) || !birthMonth || isNaN(birthMonth)) {
        DEBUG.debug('Invalid age inputs:', { year: birthYear, month: birthMonth });
        return null;
    }

    let age = currentYear - birthYear;
    
    // Adjust age if birthday hasn't occurred this year
    if (currentMonth < birthMonth) {
        age--;
    }

    DEBUG.debug('Age calculated:', { year: birthYear, month: birthMonth, age: age });
    return age;
}

function getTrainingRecommendations(result) {
    const { role, experience } = result;
    return getRecommendedTraining(role, experience);
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        DEBUG.info('Initializing application');

        // Get form elements
        const form = document.getElementById('careerForm');
        const resultsDiv = document.getElementById('results');
        const yearSelect = document.getElementById('birthYear');
        const monthSelect = document.getElementById('birthMonth');
        const hollandCodeCheckboxes = document.querySelectorAll('.holland-code');

        // Initialize form elements
        initializeForm();

        // Add event listener for form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                DEBUG.info('Form submitted, processing...');
                
                // Get form data
                const formData = new FormData(form);
                
                // Calculate age
                const birthYear = parseInt(formData.get('birthYear'));
                const birthMonth = parseInt(formData.get('birthMonth'));
                const age = calculateAge(birthYear, birthMonth);
                
                DEBUG.debug('Age calculated:', { year: birthYear, month: birthMonth, age });

                if (age === null || age < CONFIG.MIN_AGE) {
                    showNotification('Please enter a valid birth date. You must be at least 16 years old.', 'error');
                    return;
                }

                // Get Holland Code
                const selectedHollandCodes = Array.from(document.querySelectorAll('.holland-code:checked'))
                    .map(cb => {
                        // Extract first letter and convert to uppercase
                        const match = cb.value.match(/^[a-zA-Z]/);
                        return match ? match[0].toUpperCase() : '';
                    })
                    .filter(code => code !== ''); // Remove any empty codes

                if (selectedHollandCodes.length !== 3) {
                    showNotification('Please select exactly three Holland Code traits.', 'error');
                    return;
                }

                const hollandCode = selectedHollandCodes.sort().join('');
                DEBUG.debug('Holland Code:', { raw: selectedHollandCodes, normalized: hollandCode });

                // Get MBTI type
                const mbtiType = getMBTIType(formData);
                if (!mbtiType) {
                    showNotification('Please complete all personality type questions.', 'error');
                    return;
                }

                // Prepare result object
                const result = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    age,
                    constructionExperience: parseInt(formData.get('constructionExperience')) || 0,
                    hollandCode,
                    mbtiType,
                    timestamp: new Date().toISOString()
                };

                // Get recommendations first
                const hollandRecommendations = await careerRecommendationService.getHollandCodeRecommendations(hollandCode);
                const mbtiRecommendations = await careerRecommendationService.getMBTIRecommendations(mbtiType);

                // Check if we have valid recommendations
                if (!hollandRecommendations && !mbtiRecommendations) {
                    showNotification('Unable to get career recommendations at this time. Please try again later.', 'error');
                    return;
                }

                const recommendations = {
                    hollandJobs: hollandRecommendations || { jobs: [], description: 'No specific recommendations available.' },
                    mbtiJobs: mbtiRecommendations || { jobs: [], description: 'No specific recommendations available.' }
                };

                // Store response with recommendations
                const responseData = {
                    ...result,
                    recommendations: {
                        hollandJobs: recommendations.hollandJobs.jobs || [],
                        mbtiJobs: recommendations.mbtiJobs.jobs || [],
                        hollandDescription: recommendations.hollandJobs.description || '',
                        mbtiDescription: recommendations.mbtiJobs.description || ''
                    }
                };

                const responseId = await careerRecommendationService.storeSurveyResponse(responseData);
                DEBUG.info('Survey response stored with ID:', responseId);

                // Display results
                await displayResults(result, recommendations);
                
                // Show success message
                showNotification('Your career recommendations are ready!', 'success');
                
                DEBUG.info('Results displayed successfully');
                
            } catch (error) {
                DEBUG.error('Error processing form:', error);
                showNotification('There was an error processing your information. Please try again.', 'error');
            }
        });

    } catch (error) {
        console.error('Initialization failed:', error);
    }
});

// Helper function to get MBTI type
function getMBTIType(formData) {
    return (formData.get('mbtiEI') || '') +
           (formData.get('mbtiSN') || '') +
           (formData.get('mbtiTF') || '') +
           (formData.get('mbtiJP') || '');
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

function displayResults(result, recommendations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">Your Profile</h3>
                <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                <p><strong>Age:</strong> ${result.age}</p>
                <p><strong>Construction Experience:</strong> ${result.constructionExperience}</p>
                <p><strong>MBTI Type:</strong> ${result.mbtiType}</p>
                <p><strong>Holland Code:</strong> ${result.hollandCode}</p>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">Recommended Roles</h3>
                <div class="mb-4">
                    <h5>Based on Your Holland Code (${result.hollandCode})</h5>
                    ${recommendations.hollandJobs ? `
                        <p class="text-muted">${recommendations.hollandJobs.description}</p>
                        <ul class="list-unstyled">
                            ${recommendations.hollandJobs.jobs.map(job => `<li>• ${job}</li>`).join('')}
                        </ul>
                    ` : '<p>No specific recommendations available for this code combination.</p>'}
                </div>
                <div>
                    <h5>Based on Your MBTI Type (${result.mbtiType})</h5>
                    ${recommendations.mbtiJobs ? `
                        <p class="text-muted">${recommendations.mbtiJobs.description}</p>
                        <ul class="list-unstyled">
                            ${recommendations.mbtiJobs.jobs.map(job => `<li>• ${job}</li>`).join('')}
                        </ul>
                    ` : '<p>No specific recommendations available for this personality type.</p>'}
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">Next Steps</h3>
                <ul class="list-unstyled">
                    ${getNextSteps(result).map(step => `<li>• ${step}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h3 class="card-title">Recommended Training</h3>
                <ul class="list-unstyled">
                    ${getTrainingRecommendations(result).map(rec => `<li>• ${rec}</li>`).join('')}
                </ul>
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