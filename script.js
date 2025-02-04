'use strict';

import { getRecommendations, getCareerDetails as getCareerInfo } from './data/career-data.js';

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

function displayCareerCard(career, mbtiType, hollandCodes) {
    const careerDetails = getCareerInfo(career);
    const cardContent = document.createElement('div');
    cardContent.className = 'card-body';

    // Title with icon
    const title = document.createElement('h3');
    title.className = 'card-title d-flex align-items-center mb-3';
    title.innerHTML = `
        <i class="fas fa-hard-hat text-primary me-2"></i>
        ${career.title}
    `;
    cardContent.appendChild(title);

    // Overview with icon
    const overview = document.createElement('div');
    overview.className = 'mb-4';
    overview.innerHTML = `
        <h4 class="d-flex align-items-center">
            <i class="fas fa-info-circle text-info me-2"></i>
            Overview
        </h4>
        <p>${careerDetails?.description || career.description || `Specialized role combining ${mbtiType} personality traits with ${hollandCodes.join('/')} interests.`}</p>
    `;
    cardContent.appendChild(overview);

    // Education & Programs
    if (careerDetails?.education) {
        const education = document.createElement('div');
        education.className = 'mb-4';
        education.innerHTML = `
            <h4 class="d-flex align-items-center">
                <i class="fas fa-graduation-cap text-primary me-2"></i>
                Education & Programs
            </h4>
            <div class="education-section">
                <h5 class="h6 text-primary">Required Degrees</h5>
                ${careerDetails.education.degrees.map(degree => 
                    `<p><i class="fas fa-check text-success me-2"></i>${degree}</p>`
                ).join('')}
                
                <h5 class="h6 text-primary mt-3">Featured Programs</h5>
                ${careerDetails.education.schools.map(school => `
                    <div class="program-card mb-2 p-2 border rounded">
                        <h6 class="mb-1">${school.name}</h6>
                        <p class="mb-1 small">${school.program}</p>
                        <a href="${school.link}" target="_blank" class="btn btn-sm btn-outline-primary">
                            Learn More <i class="fas fa-external-link-alt ms-1"></i>
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
        cardContent.appendChild(education);
    }

    // Skills
    if (careerDetails?.skills) {
        const skills = document.createElement('div');
        skills.className = 'mb-4';
        skills.innerHTML = `
            <h4 class="d-flex align-items-center">
                <i class="fas fa-star text-warning me-2"></i>
                Required Skills
            </h4>
            <div class="row">
                <div class="col-md-6">
                    <h5 class="h6 text-primary">Technical Skills</h5>
                    ${careerDetails.skills.technical.map(skill => 
                        `<p><i class="fas fa-check text-success me-2"></i>${skill}</p>`
                    ).join('')}
                </div>
                <div class="col-md-6">
                    <h5 class="h6 text-primary">Soft Skills</h5>
                    ${careerDetails.skills.soft.map(skill => 
                        `<p><i class="fas fa-check text-success me-2"></i>${skill}</p>`
                    ).join('')}
                </div>
            </div>
        `;
        cardContent.appendChild(skills);
    }

    // Salary Information
    if (careerDetails?.salary) {
        const salary = document.createElement('div');
        salary.className = 'mb-4';
        salary.innerHTML = `
            <h4 class="d-flex align-items-center">
                <i class="fas fa-money-bill-wave text-success me-2"></i>
                Salary Range
            </h4>
            <div class="salary-ranges">
                <p><i class="fas fa-level-up-alt text-primary me-2"></i>Entry Level: ${careerDetails.salary.entry}</p>
                <p><i class="fas fa-level-up-alt text-primary me-2"></i>Mid-Career: ${careerDetails.salary.mid}</p>
                <p><i class="fas fa-level-up-alt text-primary me-2"></i>Senior Level: ${careerDetails.salary.senior}</p>
                <p class="text-muted small mt-2"><i class="fas fa-info-circle me-1"></i>${careerDetails.salary.source}</p>
            </div>
        `;
        cardContent.appendChild(salary);
    }

    // Career Path
    if (careerDetails?.careerPath) {
        const careerPath = document.createElement('div');
        careerPath.className = 'mb-4';
        careerPath.innerHTML = `
            <h4 class="d-flex align-items-center">
                <i class="fas fa-road text-info me-2"></i>
                Career Progression
            </h4>
            <div class="career-path">
                <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-arrow-right text-success me-2"></i>
                    <span class="text-muted">Entry:</span>
                    <span class="ms-2">${careerDetails.careerPath.entry}</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-arrow-right text-success me-2"></i>
                    <span class="text-muted">Mid-Level:</span>
                    <span class="ms-2">${careerDetails.careerPath.mid}</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-arrow-right text-success me-2"></i>
                    <span class="text-muted">Senior:</span>
                    <span class="ms-2">${careerDetails.careerPath.senior}</span>
                </div>
                <div class="d-flex align-items-center">
                    <i class="fas fa-arrow-right text-success me-2"></i>
                    <span class="text-muted">Executive:</span>
                    <span class="ms-2">${careerDetails.careerPath.executive}</span>
                </div>
            </div>
        `;
        cardContent.appendChild(careerPath);
    }

    // Industry Trends
    if (careerDetails?.industryTrends) {
        const trends = document.createElement('div');
        trends.className = 'mb-4';
        trends.innerHTML = `
            <h4 class="d-flex align-items-center">
                <i class="fas fa-chart-line text-primary me-2"></i>
                Industry Trends
            </h4>
            ${careerDetails.industryTrends.map(trend => 
                `<p><i class="fas fa-trending-up text-success me-2"></i>${trend}</p>`
            ).join('')}
        `;
        cardContent.appendChild(trends);
    }

    return cardContent;
}

function displayRecommendations(recommendations, mbtiType, hollandCodes, formData) {
    DEBUG.info('Starting displayRecommendations with:', { 
        recommendationsCount: recommendations?.length,
        mbtiType,
        hollandCodes,
        hasFormData: !!formData
    });
    
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
        DEBUG.error('Results div not found');
        return;
    }
    
    // Clear previous results
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'block';
    
    if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
        DEBUG.error('Invalid or empty recommendations:', recommendations);
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                No career recommendations found for your profile. Please try different selections.
            </div>
        `;
        return;
    }
    
    // Add header with personality info
    const header = document.createElement('div');
    header.className = 'results-header text-center mb-4';
    header.innerHTML = `
        <h2 class="mb-3">Your Career Recommendations</h2>
        <div class="personality-info mb-4">
            <span class="badge bg-primary me-2">MBTI: ${mbtiType}</span>
            <span class="badge bg-success">Holland Codes: ${hollandCodes.join(' / ')}</span>
        </div>
        <p class="lead">Based on your personality type and interests, here are your recommended career paths in construction:</p>
    `;
    resultsDiv.appendChild(header);
    
    // Create card container with grid layout
    const cardContainer = document.createElement('div');
    cardContainer.className = 'row row-cols-1 row-cols-md-2 g-4';
    
    recommendations.forEach((career, index) => {
        DEBUG.info(`Processing career ${index + 1}:`, career);
        
        try {
            const careerTitle = career.title ? String(career.title) : '';
            DEBUG.info(`Creating card for career: ${careerTitle}`);
            
            const cardCol = document.createElement('div');
            cardCol.className = 'col';
            
            const card = document.createElement('div');
            card.className = 'card h-100 shadow-sm';
            
            const cardBody = displayCareerCard(career, mbtiType, hollandCodes);
            
            card.appendChild(cardBody);
            cardCol.appendChild(card);
            cardContainer.appendChild(cardCol);
            
            DEBUG.info(`Successfully added career card ${index + 1}`);
        } catch (error) {
            DEBUG.error(`Error processing career ${index + 1}:`, error);
        }
    });
    
    resultsDiv.appendChild(cardContainer);
    
    // Add action buttons for PDF and Print
    addActionButtons(resultsDiv);
    
    // Ensure results are visible
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
    DEBUG.info('Finished displaying recommendations');
}

// Update the form submission handler
document.getElementById('careerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    DEBUG.info('Form submitted');
    
    try {
        DEBUG.info('Form submitted, processing...');
        const formData = new FormData(this);

        // Get MBTI type from form data
        const mbtiType = getMBTIType(formData);
        DEBUG.info('MBTI Type:', mbtiType);

        // Get Holland codes from form data
        const hollandCodes = getHollandCodes(formData);
        DEBUG.info('Holland Codes:', hollandCodes);

        if (!mbtiType) {
            showNotification('Please complete the MBTI assessment.', 'warning');
            return;
        }
        
        if (!hollandCodes || hollandCodes.length === 0) {
            showNotification('Please select at least one Holland code.', 'warning');
            return;
        }
        
        // Get recommendations
        const recommendations = getCareerRecommendations(mbtiType, hollandCodes);
        DEBUG.info('Career recommendations:', recommendations);
        
        if (!recommendations || recommendations.length === 0) {
            showNotification('No recommendations found for your selections.', 'warning');
            return;
        }
        
        // Display recommendations
        displayRecommendations(recommendations, mbtiType, hollandCodes, formData);
        
        DEBUG.info('Successfully processed form submission');
    } catch (error) {
        DEBUG.error('Error processing form:', error);
        showNotification('An error occurred while processing your responses.', 'error');
    }
});

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
        
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            try {
                DEBUG.info('Form submitted, processing...');
                const formData = new FormData(form);

                // Get MBTI type from form data
                const mbtiType = getMBTIType(formData);
                DEBUG.info('MBTI Type:', mbtiType);

                // Get Holland codes from form data
                const hollandCodes = getHollandCodes(formData);
                DEBUG.info('Holland Codes:', hollandCodes);

                if (!mbtiType) {
                    showNotification('Please complete all MBTI questions.', 'warning');
                    return;
                }

                if (!hollandCodes || hollandCodes.length === 0) {
                    showNotification('Please select at least one Holland Code personality type.', 'warning');
                    return;
                }

                // Get career recommendations
                const recommendations = getCareerRecommendations(mbtiType, hollandCodes);
                DEBUG.info('Career recommendations:', recommendations);

                if (recommendations && recommendations.length > 0) {
                    // Store results for later use
                    const results = {
                        mbtiType,
                        hollandCodes,
                        recommendations,
                        selectedCareer: recommendations[0]
                    };

                    // Display recommendations
                    displayRecommendations(recommendations, mbtiType, hollandCodes, formData);
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

/**
 * Get career recommendations based on personality assessments
 * @param {string} mbtiType - The MBTI personality type
 * @param {Array} hollandCodes - Selected Holland codes
 * @returns {Array} Array of career recommendations
 */
function getCareerRecommendations(mbtiType, hollandCodes) {
    DEBUG.info('Getting recommendations for:', { mbtiType, hollandCodes });
    
    // MBTI-based career recommendations
    const mbtiRecommendations = {
        // Analysts (NT)
        'INTJ': ['Construction Technology Director', 'Project Planning Manager', 'Quality Systems Manager'],
        'INTP': ['Construction Research Engineer', 'Systems Integration Specialist', 'Technical Consultant'],
        'ENTJ': ['Construction Executive', 'Program Director', 'Operations Manager'],
        'ENTP': ['Innovation Manager', 'Business Development Director', 'Strategy Consultant'],
        
        // Diplomats (NF)
        'INFJ': ['Sustainability Manager', 'Environmental Compliance Officer', 'Safety Director'],
        'INFP': ['Green Building Consultant', 'Environmental Impact Analyst', 'Workplace Safety Specialist'],
        'ENFJ': ['Training Director', 'Team Development Manager', 'HR Director'],
        'ENFP': ['Client Relations Director', 'Construction Business Developer', 'Project Development Manager'],
        
        // Sentinels (SJ)
        'ISTJ': ['Quality Control Manager', 'Compliance Officer', 'Technical Director'],
        'ISFJ': ['Safety Coordinator', 'Quality Assurance Specialist', 'Resource Manager'],
        'ESTJ': ['Project Manager', 'Site Superintendent', 'Operations Director'],
        'ESFJ': ['Client Services Manager', 'Team Coordinator', 'Community Relations Director'],
        
        // Explorers (SP)
        'ISTP': ['Technical Specialist', 'Equipment Manager', 'Site Engineer'],
        'ISFP': ['Design Implementation Specialist', 'Interior Construction Coordinator', 'Materials Specialist'],
        'ESTP': ['Site Manager', 'Field Operations Director', 'Emergency Response Coordinator'],
        'ESFP': ['Site Safety Coordinator', 'Team Leader', 'Public Relations Manager']
    };
    
    // Get base recommendations from MBTI type
    let recommendations = [];
    if (mbtiRecommendations[mbtiType]) {
        recommendations = mbtiRecommendations[mbtiType].map(title => ({
            title,
            description: `Specialized role combining ${mbtiType} personality traits with ${hollandCodes.join('/')} interests.`,
            responsibilities: [
                'Lead and coordinate construction projects',
                'Implement industry best practices',
                'Manage teams and resources',
                'Drive project success'
            ],
            skills: [
                'Advanced technical knowledge',
                'Leadership abilities',
                'Project management',
                'Problem-solving'
            ],
            education: 'Relevant degree or certification preferred',
            salaryRange: {
                starting: '$60,000 - $80,000',
                experienced: '$90,000 - $120,000'
            }
        }));
    }
    
    DEBUG.info('MBTI recommendations:', recommendations);
    
    // Filter and sort recommendations based on Holland codes
    const matchingCareers = recommendations.filter(career => {
        // Simple matching algorithm - could be made more sophisticated
        return hollandCodes.some(code => 
            career.title.toLowerCase().includes(getHollandCodeKeywords(code))
        );
    });
    
    DEBUG.info('Matching careers:', matchingCareers);
    
    return matchingCareers.length > 0 ? matchingCareers : recommendations.slice(0, 3);
}

function getHollandCodeKeywords(code) {
    const keywords = {
        'R': ['technical', 'engineer', 'specialist'],
        'I': ['research', 'analyst', 'systems'],
        'A': ['design', 'creative', 'innovation'],
        'S': ['training', 'coordinator', 'relations'],
        'E': ['manager', 'director', 'business'],
        'C': ['compliance', 'quality', 'control']
    };
    
    return keywords[code] || [];
}

function getMBTIType(formData) {
    return (formData.get('mbtiEI') || '') +
           (formData.get('mbtiSN') || '') +
           (formData.get('mbtiTF') || '') +
           (formData.get('mbtiJP') || '');
}

function getHollandCodes(formData) {
    DEBUG.info('Getting Holland codes from form data');
    const hollandCodes = [];
    
    // Get all selected Holland codes
    const selectedCodes = formData.getAll('hollandCode');
    DEBUG.info('Selected Holland codes from form:', selectedCodes);
    
    // Map the values to their corresponding codes
    const codeMap = {
        'realistic': 'R',
        'investigative': 'I',
        'artistic': 'A',
        'social': 'S',
        'enterprising': 'E',
        'conventional': 'C'
    };
    
    selectedCodes.forEach(value => {
        const code = codeMap[value];
        if (code) {
            hollandCodes.push(code);
        }
    });
    
    DEBUG.info('Mapped Holland codes:', hollandCodes);
    return hollandCodes;
}

/**
 * Save a career for later reference
 * @param {string} careerTitle - Title of the career to save
 * @param {Event} event - Click event
 */
function saveCareer(careerTitle, event) {
    event.preventDefault();
    // Store in localStorage
    const savedCareers = JSON.parse(localStorage.getItem('savedCareers') || '[]');
    if (!savedCareers.includes(careerTitle)) {
        savedCareers.push(careerTitle);
        localStorage.setItem('savedCareers', JSON.stringify(savedCareers));
        showNotification(`${careerTitle} has been saved to your profile`, 'success');
    } else {
        showNotification(`${careerTitle} is already saved`, 'info');
    }
}

/**
 * Handle learn more action for a career
 * @param {string} careerTitle - Title of the career
 * @param {Event} event - Click event
 */
function applyForPosition(careerTitle, event) {
    event.preventDefault();
    
    // Create career-specific URLs based on title
    const careerUrls = {
        'Construction Project Manager': 'https://www.embersstaffing.com/careers/construction-project-manager',
        'Safety Manager': 'https://www.embersstaffing.com/careers/safety-manager',
        'Sustainability Consultant': 'https://www.embersstaffing.com/careers/sustainability-consultant',
        'Construction Professional': 'https://www.embersstaffing.com/careers/construction'
    };

    // Get the specific URL or use the default careers page
    const careerUrl = careerUrls[careerTitle] || 'https://www.embersstaffing.com/careers';
    
    // Open in new tab
    window.open(careerUrl, '_blank');
    
    // Show notification
    showNotification(`Opening career details for ${careerTitle}`, 'info');
}

const careerRecommendations = {
    'ISTJ': {
        'R': ['Construction Project Manager', 'Site Supervisor', 'Safety Inspector'],
        'I': ['Structural Engineer', 'Civil Engineer', 'Building Inspector'],
        'C': ['Construction Estimator', 'Quality Control Manager', 'Building Code Inspector']
    },
    'ISFJ': {
        'S': ['Construction Safety Manager', 'Environmental Compliance Officer', 'Site Safety Coordinator'],
        'C': ['Construction Document Controller', 'Quality Assurance Specialist', 'Permit Coordinator'],
        'R': ['Facilities Manager', 'Maintenance Supervisor', 'Building Systems Specialist']
    },
    'INFJ': {
        'A': ['Sustainable Design Specialist', 'Green Building Consultant', 'Architecture Project Manager'],
        'S': ['Construction Training Manager', 'Safety Program Developer', 'Environmental Impact Analyst'],
        'I': ['Building Systems Designer', 'Urban Planning Specialist', 'Sustainability Consultant']
    },
    'INTJ': {
        'I': ['Construction Technology Specialist', 'BIM Manager', 'Systems Integration Engineer'],
        'E': ['Construction Innovation Manager', 'Process Improvement Specialist', 'Technical Director'],
        'A': ['Design-Build Coordinator', 'Construction Solutions Architect', 'Project Innovation Lead']
    },
    'ISTP': {
        'R': ['Heavy Equipment Operator', 'Crane Operator', 'Mechanical Systems Specialist'],
        'I': ['Construction Equipment Technician', 'Robotics Specialist', 'Automation Technician'],
        'E': ['Site Operations Manager', 'Equipment Fleet Manager', 'Technical Operations Lead']
    },
    'ISFP': {
        'A': ['Interior Finishing Specialist', 'Architectural Detailer', 'Design Implementation Specialist'],
        'R': ['Skilled Craftsperson', 'Custom Fabricator', 'Specialty Trade Contractor'],
        'S': ['Site Beautification Specialist', 'Landscape Implementation Lead', 'Finishing Coordinator']
    },
    'INFP': {
        'A': ['Sustainable Design Coordinator', 'Green Building Specialist', 'Environmental Design Consultant'],
        'S': ['Community Relations Manager', 'Environmental Impact Coordinator', 'Sustainability Advocate'],
        'I': ['Design Research Specialist', 'Building Performance Analyst', 'Innovation Consultant']
    },
    'INTP': {
        'I': ['Construction Systems Analyst', 'Building Technology Specialist', 'Technical Solutions Architect'],
        'A': ['Design Technology Specialist', 'Digital Construction Manager', 'Virtual Design Coordinator'],
        'E': ['Construction Research Specialist', 'Building Science Expert', 'Technical Innovation Lead']
    },
    'ESTP': {
        'E': ['Construction Operations Manager', 'Site Logistics Coordinator', 'Field Operations Director'],
        'R': ['General Contractor', 'Construction Superintendent', 'Project Execution Manager'],
        'C': ['Construction Procurement Manager', 'Contract Administrator', 'Project Controls Manager']
    },
    'ESFP': {
        'S': ['Construction Client Relations Manager', 'Public Relations Coordinator', 'Community Outreach Specialist'],
        'E': ['Site Team Leader', 'Construction Crew Supervisor', 'Field Operations Coordinator'],
        'A': ['Interior Design Implementation Lead', 'Space Planning Coordinator', 'Design-Build Liaison']
    },
    'ENFP': {
        'S': ['Construction Training Coordinator', 'Team Development Manager', 'Workforce Engagement Specialist'],
        'E': ['Construction Business Developer', 'Client Relations Director', 'Project Development Manager'],
        'A': ['Design Innovation Specialist', 'Creative Solutions Manager', 'Project Vision Coordinator']
    },
    'ENTP': {
        'E': ['Construction Strategy Manager', 'Innovation Director', 'Business Development Lead'],
        'I': ['Construction Technology Manager', 'Digital Solutions Architect', 'Technical Innovation Manager'],
        'A': ['Design Integration Specialist', 'Solutions Architecture Manager', 'Innovation Consultant']
    },
    'ESTJ': {
        'E': ['Construction Executive', 'Project Director', 'Operations Manager'],
        'C': ['Construction Manager', 'Project Manager', 'Site Manager'],
        'R': ['Production Manager', 'Field Operations Director', 'Implementation Manager']
    },
    'ESFJ': {
        'S': ['Construction HR Manager', 'Team Relations Coordinator', 'Safety Culture Manager'],
        'E': ['Construction Office Manager', 'Administrative Director', 'Support Services Manager'],
        'C': ['Quality Assurance Manager', 'Compliance Coordinator', 'Standards Implementation Lead']
    },
    'ENFJ': {
        'S': ['Construction Training Director', 'Workforce Development Manager', 'Team Building Specialist'],
        'E': ['Project Leadership Manager', 'Strategic Relations Director', 'Development Coordinator'],
        'A': ['Design Team Leader', 'Creative Director', 'Project Vision Manager']
    },
    'ENTJ': {
        'E': ['Construction Company CEO', 'Executive Director', 'Strategic Operations Manager'],
        'I': ['Technical Director', 'Innovation Strategy Manager', 'Systems Integration Director'],
        'C': ['Program Director', 'Portfolio Manager', 'Enterprise Solutions Manager']
    }
};

// Training recommendations based on experience level
const trainingRecommendations = {
    'entry': {
        'general': [
            'OSHA 10-Hour Construction Safety Course',
            'First Aid and CPR Certification',
            'Basic Construction Math',
            'Blueprint Reading Fundamentals',
            'Construction Tools and Equipment Safety'
        ],
        'specific': {
            'project_management': [
                'Construction Project Management Basics',
                'Microsoft Office Suite (Excel, Project)',
                'Construction Scheduling Fundamentals',
                'Basic Cost Estimation'
            ],
            'skilled_trades': [
                'Trade-Specific Apprenticeship Programs',
                'Hand and Power Tool Safety',
                'Basic Welding Safety',
                'Material Handling Training'
            ],
            'engineering': [
                'AutoCAD Basics',
                'Construction Materials Science',
                'Basic Structural Principles',
                'Site Survey Fundamentals'
            ],
            'supervision': [
                'Leadership Skills for New Supervisors',
                'Construction Communication Basics',
                'Team Building Fundamentals',
                'Basic Project Planning'
            ]
        }
    },
    'intermediate': {
        'general': [
            'OSHA 30-Hour Construction Safety Course',
            'Advanced Blueprint Reading',
            'Construction Quality Control',
            'Risk Management Basics',
            'Construction Contract Fundamentals'
        ],
        'specific': {
            'project_management': [
                'PMP Certification Prep',
                'Advanced Construction Scheduling',
                'Construction Cost Control',
                'Construction Technology Solutions'
            ],
            'skilled_trades': [
                'Advanced Trade Certifications',
                'Equipment Operation Certification',
                'Advanced Safety Training',
                'Quality Control Inspection'
            ],
            'engineering': [
                'BIM Software Training',
                'Advanced Structural Analysis',
                'Construction Methods and Materials',
                'Environmental Compliance'
            ],
            'supervision': [
                'Advanced Leadership Training',
                'Project Team Management',
                'Construction Law Basics',
                'Resource Management'
            ]
        }
    },
    'experienced': {
        'general': [
            'Construction Risk Management',
            'Advanced Contract Management',
            'Construction Finance and Accounting',
            'Sustainable Construction Practices',
            'Construction Law and Ethics'
        ],
        'specific': {
            'project_management': [
                'Program Management Professional (PgMP)',
                'Construction Executive Management',
                'Strategic Project Management',
                'Advanced Risk Management'
            ],
            'skilled_trades': [
                'Master Trade Certifications',
                'Train-the-Trainer Programs',
                'Safety Management Systems',
                'Quality Management Systems'
            ],
            'engineering': [
                'Advanced BIM Management',
                'Construction Innovation and Technology',
                'Sustainable Design and Construction',
                'Value Engineering'
            ],
            'supervision': [
                'Executive Leadership Development',
                'Strategic Planning',
                'Change Management',
                'Advanced Project Controls'
            ]
        }
    }
};

/**
 * Get training recommendations based on MBTI, Holland codes, and experience
 * @param {string} mbtiType - MBTI personality type
 * @param {Array} hollandCodes - Selected Holland codes
 * @param {FormData} formData - Form data
 * @returns {Object} Training recommendations object with general and specific recommendations
 */
function getTrainingRecommendations(mbtiType, hollandCodes, formData) {
    DEBUG.info('Getting training recommendations for:', { mbtiType, hollandCodes });

    // Role-specific training recommendations
    const roleTraining = {
        // Analysts (NT)
        'INTJ': {
            technical: ['Advanced BIM Software Certification', 'Construction Technology Management', 'Quality Management Systems'],
            soft: ['Strategic Planning', 'Systems Thinking Workshop', 'Technical Leadership'],
            certifications: ['PMP', 'Six Sigma Black Belt', 'Quality Management Professional']
        },
        'INTP': {
            technical: ['Construction Data Analytics', 'Advanced Modeling Software', 'Systems Integration'],
            soft: ['Problem-Solving Methodologies', 'Innovation Management', 'Technical Communication'],
            certifications: ['Data Analytics Professional', 'Systems Engineering Professional', 'Technical Consultant Certification']
        },
        'ENTJ': {
            technical: ['Enterprise Resource Planning', 'Program Management', 'Strategic Operations'],
            soft: ['Executive Leadership', 'Change Management', 'Strategic Decision Making'],
            certifications: ['Executive MBA', 'Program Management Professional', 'Construction Executive Certification']
        },
        'ENTP': {
            technical: ['Innovation Management Systems', 'Business Development Strategies', 'Digital Transformation'],
            soft: ['Creative Problem Solving', 'Strategic Innovation', 'Client Relations'],
            certifications: ['Innovation Management Professional', 'Digital Strategy Certification', 'Business Development Professional']
        },

        // Diplomats (NF)
        'INFJ': {
            technical: ['Sustainable Construction Practices', 'Environmental Management Systems', 'Safety Management'],
            soft: ['Team Development', 'Conflict Resolution', 'Sustainability Leadership'],
            certifications: ['LEED AP', 'Safety Management Specialist', 'Environmental Management Professional']
        },
        'INFP': {
            technical: ['Green Building Technologies', 'Environmental Impact Assessment', 'Sustainable Design'],
            soft: ['Environmental Communication', 'Stakeholder Engagement', 'Sustainability Planning'],
            certifications: ['Green Building Professional', 'Environmental Assessment Specialist', 'Sustainability Consultant']
        },
        'ENFJ': {
            technical: ['Training Program Development', 'HR Management Systems', 'Leadership Development'],
            soft: ['Advanced Facilitation', 'Team Building', 'Organizational Development'],
            certifications: ['Training & Development Professional', 'HR Management Professional', 'Leadership Coach Certification']
        },
        'ENFP': {
            technical: ['Client Relations Management', 'Business Development', 'Project Development'],
            soft: ['Relationship Building', 'Creative Leadership', 'Stakeholder Management'],
            certifications: ['Business Development Professional', 'Client Relations Manager', 'Project Development Specialist']
        },

        // Sentinels (SJ)
        'ISTJ': {
            technical: ['Quality Control Systems', 'Technical Documentation', 'Compliance Management'],
            soft: ['Process Improvement', 'Technical Supervision', 'Standards Implementation'],
            certifications: ['Quality Control Professional', 'Technical Manager Certification', 'Compliance Officer']
        },
        'ISFJ': {
            technical: ['Safety Management Systems', 'Quality Assurance', 'Resource Management'],
            soft: ['Team Coordination', 'Safety Leadership', 'Resource Optimization'],
            certifications: ['Safety Professional', 'Quality Assurance Specialist', 'Resource Management Professional']
        },
        'ESTJ': {
            technical: ['Project Management', 'Construction Operations', 'Site Management'],
            soft: ['Leadership Skills', 'Team Management', 'Operational Excellence'],
            certifications: ['PMP', 'Construction Manager', 'Operations Management Professional']
        },
        'ESFJ': {
            technical: ['Client Service Management', 'Team Coordination', 'Community Relations'],
            soft: ['People Management', 'Customer Service Excellence', 'Community Engagement'],
            certifications: ['Customer Service Professional', 'Team Leader Certification', 'Community Relations Manager']
        },

        // Explorers (SP)
        'ISTP': {
            technical: ['Technical Systems', 'Equipment Management', 'Site Engineering'],
            soft: ['Technical Problem Solving', 'Hands-on Leadership', 'Equipment Operations'],
            certifications: ['Technical Specialist', 'Equipment Manager', 'Site Engineer Professional']
        },
        'ISFP': {
            technical: ['Design Implementation', 'Interior Construction', 'Materials Management'],
            soft: ['Design Thinking', 'Aesthetic Awareness', 'Materials Selection'],
            certifications: ['Design Implementation Specialist', 'Interior Construction Professional', 'Materials Specialist']
        },
        'ESTP': {
            technical: ['Site Operations', 'Field Management', 'Emergency Response'],
            soft: ['Crisis Management', 'Operational Leadership', 'Quick Decision Making'],
            certifications: ['Site Manager Professional', 'Field Operations Director', 'Emergency Response Coordinator']
        },
        'ESFP': {
            technical: ['Site Safety Systems', 'Team Leadership', 'Public Relations'],
            soft: ['Safety Communication', 'Team Motivation', 'Public Speaking'],
            certifications: ['Site Safety Coordinator', 'Team Leader', 'Public Relations Professional']
        }
    };

    const hollandTraining = {
        'R': {
            technical: ['Technical Skills Development', 'Equipment Operation', 'Hands-on Construction Methods'],
            soft: ['Technical Problem Solving', 'Spatial Awareness', 'Physical Coordination'],
            certifications: ['Technical Specialist', 'Equipment Operator', 'Construction Technician']
        },
        'I': {
            technical: ['Research Methods', 'Data Analysis', 'Technical Documentation'],
            soft: ['Analytical Thinking', 'Research Skills', 'Technical Writing'],
            certifications: ['Research Professional', 'Data Analyst', 'Technical Documentation Specialist']
        },
        'A': {
            technical: ['Design Software', 'Creative Solutions', 'Aesthetic Planning'],
            soft: ['Creative Thinking', 'Design Principles', 'Visual Communication'],
            certifications: ['Design Professional', 'Creative Solutions Specialist', 'Visual Design Coordinator']
        },
        'S': {
            technical: ['People Management', 'Training Development', 'Communication Systems'],
            soft: ['Interpersonal Skills', 'Teaching Methods', 'Active Listening'],
            certifications: ['Training Professional', 'Communication Specialist', 'People Management Coordinator']
        },
        'E': {
            technical: ['Business Management', 'Leadership Development', 'Strategic Planning'],
            soft: ['Leadership Skills', 'Persuasion', 'Decision Making'],
            certifications: ['Business Management Professional', 'Leadership Development Specialist', 'Strategic Planning Coordinator']
        },
        'C': {
            technical: ['Quality Control', 'Documentation Systems', 'Compliance Management'],
            soft: ['Attention to Detail', 'Organization Skills', 'Process Management'],
            certifications: ['Quality Control Professional', 'Documentation Specialist', 'Compliance Coordinator']
        }
    };

    let recommendations = {
        technical: new Set(),
        soft: new Set(),
        certifications: new Set()
    };

    // Add MBTI-specific recommendations
    if (roleTraining[mbtiType]) {
        roleTraining[mbtiType].technical.forEach(item => recommendations.technical.add(item));
        roleTraining[mbtiType].soft.forEach(item => recommendations.soft.add(item));
        roleTraining[mbtiType].certifications.forEach(item => recommendations.certifications.add(item));
    }

    // Add Holland code specific recommendations
    hollandCodes.forEach(code => {
        if (hollandTraining[code]) {
            hollandTraining[code].technical.forEach(item => recommendations.technical.add(item));
            hollandTraining[code].soft.forEach(item => recommendations.soft.add(item));
            hollandTraining[code].certifications.forEach(item => recommendations.certifications.add(item));
        }
    });

    return {
        technical: Array.from(recommendations.technical).slice(0, 5),
        soft: Array.from(recommendations.soft).slice(0, 5),
        certifications: Array.from(recommendations.certifications).slice(0, 5)
    };
}

function displayTrainingRecommendations(training) {
    DEBUG.info('Displaying training recommendations:', training);
    
    const trainingDiv = document.createElement('div');
    trainingDiv.className = 'training-recommendations mb-4';
    
    trainingDiv.innerHTML = `
        <h4 class="d-flex align-items-center mb-3">
            <i class="fas fa-certificate text-warning me-2"></i>
            Recommended Training & Certifications
        </h4>
        
        ${training.technical.length > 0 ? `
            <div class="mb-3">
                <h5 class="text-primary"><i class="fas fa-tools me-2"></i>Technical Skills</h5>
                ${training.technical.map(skill => `<p><i class="fas fa-check text-success me-2"></i>${skill}</p>`).join('')}
            </div>
        ` : ''}
        
        ${training.soft.length > 0 ? `
            <div class="mb-3">
                <h5 class="text-primary"><i class="fas fa-users me-2"></i>Soft Skills</h5>
                ${training.soft.map(skill => `<p><i class="fas fa-check text-success me-2"></i>${skill}</p>`).join('')}
            </div>
        ` : ''}
        
        ${training.certifications.length > 0 ? `
            <div class="mb-3">
                <h5 class="text-primary"><i class="fas fa-award me-2"></i>Professional Certifications</h5>
                ${training.certifications.map(cert => `<p><i class="fas fa-check text-success me-2"></i>${cert}</p>`).join('')}
            </div>
        ` : ''}
    `;
    
    return trainingDiv;
}

/**
 * Generate and download results as PDF
 */
async function saveAsPDF() {
    DEBUG.info('Starting PDF generation');
    const element = document.getElementById('results');
    
    if (!element) {
        DEBUG.error('Results element not found');
        showNotification('Unable to generate PDF: Results not found', 'error');
        return;
    }
    
    const options = {
        margin: 1,
        filename: 'construction-career-recommendations.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
        // Add a temporary class for PDF styling
        element.classList.add('pdf-mode');
        
        // Generate PDF
        await html2pdf().set(options).from(element).save();
        
        // Remove the temporary class
        element.classList.remove('pdf-mode');
        
        DEBUG.info('PDF generated successfully');
        showNotification('PDF generated successfully!', 'success');
    } catch (error) {
        DEBUG.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

/**
 * Print the results
 */
function printResults() {
    DEBUG.info('Starting print process');
    const resultsDiv = document.getElementById('results');
    
    if (!resultsDiv) {
        DEBUG.error('Results element not found');
        showNotification('Unable to print: Results not found', 'error');
        return;
    }

    try {
        // Add print-specific styling class
        resultsDiv.classList.add('print-mode');
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Unable to open print window');
        }
        
        // Add necessary styles
        printWindow.document.write(`
            <html>
            <head>
                <title>Construction Career Recommendations</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    .card { margin-bottom: 20px; break-inside: avoid; }
                    @media print {
                        .card { page-break-inside: avoid; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${resultsDiv.outerHTML}
            </body>
            </html>
        `);
        
        // Wait for resources to load
        printWindow.document.close();
        printWindow.onload = function() {
            printWindow.focus();
            printWindow.print();
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        };
        
        // Remove print-specific styling
        resultsDiv.classList.remove('print-mode');
        
        DEBUG.info('Print dialog opened successfully');
    } catch (error) {
        DEBUG.error('Error opening print dialog:', error);
        showNotification('Error opening print dialog. Please try again.', 'error');
        resultsDiv.classList.remove('print-mode');
    }
}

// Add the action buttons after displaying recommendations
function addActionButtons(resultsDiv) {
    DEBUG.info('Adding action buttons');
    
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons mt-4 mb-4';
    actionButtons.innerHTML = `
        <div class="d-flex justify-content-center flex-wrap gap-4">
            <div class="action-card text-center" onclick="saveAsPDF()">
                <div class="action-icon mb-2">
                    <i class="fas fa-file-pdf fa-2x text-danger"></i>
                </div>
                <h5 class="action-title">Save as PDF</h5>
                <p class="action-description text-muted">Download your career recommendations</p>
            </div>
            <div class="action-card text-center" onclick="printResults()">
                <div class="action-icon mb-2">
                    <i class="fas fa-print fa-2x text-primary"></i>
                </div>
                <h5 class="action-title">Print Results</h5>
                <p class="action-description text-muted">Print your career recommendations</p>
            </div>
        </div>
    `;
    
    // Add CSS for action cards
    const style = document.createElement('style');
    style.textContent = `
        .action-card {
            padding: 1.5rem;
            border-radius: 10px;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            width: 200px;
        }
        
        .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .action-icon {
            background: #f8f9fa;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }
        
        .action-title {
            margin: 0.5rem 0;
            font-weight: 600;
        }
        
        .action-description {
            font-size: 0.9rem;
            margin-bottom: 0;
        }
        
        @media print {
            .action-buttons {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    resultsDiv.appendChild(actionButtons);
    DEBUG.info('Action buttons added successfully');
}