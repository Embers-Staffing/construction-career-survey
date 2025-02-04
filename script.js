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

function displayRecommendations(recommendations) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Your Career Recommendations</h2>
        ${recommendations.map(career => `
            <div class="career-card">
                <div class="career-card-header">
                    <h3>${career.title}</h3>
                    <div class="salary">
                        <div>Starting Salary: ${career.salaryRange?.entry || '$45,000 - $55,000'}</div>
                        <div>Experienced Salary: ${career.salaryRange?.experienced || '$65,000 - $95,000'}</div>
                    </div>
                </div>
                <div class="career-card-body">
                    <div class="career-card-section">
                        <h4>Role Overview</h4>
                        <p>${career.description || 'A rewarding career in construction awaits!'}</p>
                    </div>
                    
                    <div class="career-card-section">
                        <h4>Key Responsibilities</h4>
                        <ul>
                            ${(career.responsibilities || [
                                'Project planning and execution',
                                'Team coordination',
                                'Quality assurance',
                                'Safety compliance'
                            ]).map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="career-card-section">
                        <h4>Required Skills</h4>
                        <div class="skills-tags">
                            ${(career.skills || [
                                'Project Management',
                                'Leadership',
                                'Technical Knowledge',
                                'Communication'
                            ]).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>

                    <div class="career-card-section">
                        <h4>Education & Training</h4>
                        <div class="education-section">
                            <h5>Required Education</h5>
                            <ul>
                                ${(career.education || [
                                    'High School Diploma or equivalent',
                                    'Technical certification preferred'
                                ]).map(edu => `<li>${edu}</li>`).join('')}
                            </ul>
                            
                            <h5>Recommended Training Programs</h5>
                            <ul>
                                ${(career.training || [
                                    'OSHA Safety Certification',
                                    'Project Management Certification',
                                    'Industry-specific technical training'
                                ]).map(training => `<li>${training}</li>`).join('')}
                            </ul>
                            
                            <h5>Professional Certifications</h5>
                            <ul>
                                ${(career.certifications || [
                                    'Industry standard certifications',
                                    'Professional association memberships'
                                ]).map(cert => `<li>${cert}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="career-card-section">
                        <h4>Career Growth</h4>
                        <div class="growth-path">
                            <h5>Career Progression</h5>
                            <ul>
                                ${(career.careerPath || [
                                    'Entry Level Position',
                                    'Mid-Level Management',
                                    'Senior Management',
                                    'Executive Level'
                                ]).map(path => `<li>${path}</li>`).join('')}
                            </ul>
                            
                            <h5>Timeline</h5>
                            <ul>
                                ${(career.timeline || [
                                    '0-2 years: Entry level position',
                                    '2-5 years: Mid-level role',
                                    '5-10 years: Senior position',
                                    '10+ years: Leadership role'
                                ]).map(time => `<li>${time}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="growth-indicator">
                        Strong growth potential in this role
                    </div>

                    <div class="action-links">
                        <a href="#" class="action-link" onclick="saveCareer('${career.title}', event)">
                            Save for Later
                        </a>
                        <a href="#" class="action-link" onclick="applyForPosition('${career.title}', event)">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        `).join('')}
    `;
    resultsDiv.style.display = 'block';
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
                const recommendations = getCareerRecommendations(mbtiType);
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
                    displayRecommendations(careerDetails);
                    
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

/**
 * Get career recommendations based on MBTI type
 * @param {string} mbtiType - The MBTI personality type
 * @returns {Array} Array of career recommendations
 */
function getCareerRecommendations(mbtiType) {
    // Default recommendations if MBTI type is not found
    const defaultRecommendations = [{
        title: 'Construction Professional',
        salaryRange: {
            entry: '$45,000 - $60,000',
            experienced: '$70,000 - $100,000'
        },
        description: 'Join the exciting field of construction with opportunities for growth and development.',
        responsibilities: [
            'Contribute to construction projects',
            'Learn industry best practices',
            'Work with experienced professionals',
            'Develop technical skills'
        ],
        skills: [
            'Technical Knowledge',
            'Teamwork',
            'Communication',
            'Problem Solving'
        ],
        education: [
            'High School Diploma or equivalent',
            'Trade school or technical training recommended'
        ],
        training: [
            'OSHA Safety Training',
            'Equipment Operation Certification',
            'Industry-specific skills training'
        ],
        certifications: [
            'Industry-relevant certifications',
            'Safety certifications'
        ],
        careerPath: [
            'Entry Level Position (0-2 years)',
            'Skilled Professional (2-5 years)',
            'Team Lead (5-8 years)',
            'Supervisor (8+ years)'
        ],
        timeline: [
            '0-2 years: Learn fundamentals and gain experience',
            '2-5 years: Develop specialized skills',
            '5-8 years: Take on leadership responsibilities',
            '8+ years: Advanced career opportunities'
        ]
    }];

    // Get specific recommendations for the MBTI type
    const specificRecommendation = careerRecommendations[mbtiType];
    return specificRecommendation ? [specificRecommendation] : defaultRecommendations;
}

function getMBTIType(formData) {
    return (formData.get('mbtiEI') || '') +
           (formData.get('mbtiSN') || '') +
           (formData.get('mbtiTF') || '') +
           (formData.get('mbtiJP') || '');
}

function saveCareer(careerTitle, event) {
    // Prevent default link behavior
    event.preventDefault();
    
    // Show a success message
    showNotification(`${careerTitle} has been saved to your profile`, 'success');
}

function applyForPosition(careerTitle, event) {
    // Prevent default link behavior
    event.preventDefault();
    
    // Open Embers Staffing career page in a new tab
    window.open('https://www.embersstaffing.com/careers', '_blank');
    
    // Show a notification
    showNotification(`Redirecting you to learn more about ${careerTitle}`, 'info');
}

const careerRecommendations = {
    'ISTJ': {
        title: 'Construction Project Manager',
        salaryRange: {
            entry: '$55,000 - $70,000',
            experienced: '$85,000 - $130,000'
        },
        description: 'Lead and oversee construction projects from inception to completion, ensuring all work is completed on time, within budget, and to quality standards.',
        responsibilities: [
            'Develop and manage project schedules and budgets',
            'Coordinate with subcontractors and suppliers',
            'Ensure compliance with safety regulations and building codes',
            'Monitor project progress and report to stakeholders'
        ],
        skills: [
            'Project Management',
            'Budget Control',
            'Technical Knowledge',
            'Detail-Oriented',
            'Leadership'
        ],
        education: [
            'Bachelor\'s degree in Construction Management, Engineering, or related field',
            'Project Management Professional (PMP) certification preferred'
        ],
        training: [
            'OSHA 30-Hour Construction Safety Certification',
            'Construction Project Management Certification',
            'Building Information Modeling (BIM) Training'
        ],
        certifications: [
            'Certified Construction Manager (CCM)',
            'LEED Accredited Professional',
            'Project Management Professional (PMP)'
        ],
        careerPath: [
            'Assistant Project Manager (0-3 years)',
            'Project Manager (3-7 years)',
            'Senior Project Manager (7-12 years)',
            'Construction Director (12+ years)'
        ],
        timeline: [
            '0-3 years: Learn fundamentals and assist in project management',
            '3-7 years: Manage medium-sized projects independently',
            '7-12 years: Handle large-scale projects and mentor junior managers',
            '12+ years: Strategic planning and organizational leadership'
        ]
    },
    'ISFJ': {
        title: 'Safety Manager',
        salaryRange: {
            entry: '$50,000 - $65,000',
            experienced: '$75,000 - $110,000'
        },
        description: 'Ensure workplace safety by developing and implementing safety programs, conducting inspections, and training employees on safety procedures.',
        responsibilities: [
            'Develop and implement safety policies and procedures',
            'Conduct safety training and inspections',
            'Investigate incidents and maintain safety records',
            'Ensure OSHA compliance and workplace safety'
        ],
        skills: [
            'Safety Management',
            'Risk Assessment',
            'Training & Development',
            'Documentation',
            'Communication'
        ],
        education: [
            'Bachelor\'s degree in Occupational Safety, Engineering, or related field',
            'Advanced safety certifications required'
        ],
        training: [
            'OSHA Safety Certifications',
            'First Aid and CPR Training',
            'Hazardous Materials Management'
        ],
        certifications: [
            'Certified Safety Professional (CSP)',
            'Construction Health and Safety Technician (CHST)',
            'OSHA Authorized Trainer'
        ],
        careerPath: [
            'Safety Coordinator (0-3 years)',
            'Safety Manager (3-7 years)',
            'Regional Safety Director (7-12 years)',
            'Corporate Safety Director (12+ years)'
        ],
        timeline: [
            '0-3 years: Learn safety regulations and assist in program implementation',
            '3-7 years: Manage site safety programs independently',
            '7-12 years: Oversee multiple site safety operations',
            '12+ years: Develop company-wide safety strategies'
        ]
    },
    'INFJ': {
        title: 'Sustainability Consultant',
        salaryRange: {
            entry: '$45,000 - $65,000',
            experienced: '$80,000 - $120,000'
        },
        description: 'Guide construction projects in implementing sustainable practices, ensuring environmental compliance, and achieving green building certifications.',
        responsibilities: [
            'Develop sustainable construction strategies',
            'Conduct environmental impact assessments',
            'Advise on green building certifications',
            'Coordinate with stakeholders on sustainability goals'
        ],
        skills: [
            'Sustainability Planning',
            'Green Building Standards',
            'Environmental Analysis',
            'Stakeholder Management',
            'Technical Writing'
        ],
        education: [
            'Bachelor\'s degree in Environmental Science, Engineering, or related field',
            'Master\'s degree preferred in Sustainable Development'
        ],
        training: [
            'LEED Green Associate Training',
            'Sustainable Construction Practices',
            'Environmental Management Systems'
        ],
        certifications: [
            'LEED Accredited Professional',
            'WELL AP Certification',
            'Green Globes Professional'
        ],
        careerPath: [
            'Junior Sustainability Consultant (0-3 years)',
            'Sustainability Consultant (3-7 years)',
            'Senior Sustainability Manager (7-12 years)',
            'Director of Sustainability (12+ years)'
        ],
        timeline: [
            '0-3 years: Learn sustainable practices and assist in assessments',
            '3-7 years: Lead sustainability projects independently',
            '7-12 years: Manage complex sustainable development initiatives',
            '12+ years: Shape organizational sustainability strategy'
        ]
    }
};