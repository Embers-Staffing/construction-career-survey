'use strict';

import { getRecommendations, getCareerDetails as getCareerInfo } from './data/career-data.js';

// Debug utility
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

// Configuration
const CONFIG = {
    MIN_AGE: 16,
    MAX_AGE: 65,
    AUTO_FILL_MODE: false
};

/**
 * Show notification message to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (info, warning, error)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Initialize form with dynamic content and event listeners
 */
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
        option.value = year.toString();
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
        option.value = month.toString();
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

    // Add form submission handler
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Handle form submission
 * @param {Event} event - Form submission event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    DEBUG.info('Form submitted');

    try {
        const formData = new FormData(event.target);
        
        // Get MBTI type from form data or event detail
        const mbtiType = event.detail?.mbtiType || getMBTIType(formData);
        if (!mbtiType || mbtiType === 'XXXX') {
            throw new Error('Please complete the MBTI assessment');
        }
        DEBUG.info('MBTI Type:', mbtiType);

        // Get Holland codes from form data or event detail
        let hollandCodes = event.detail?.hollandCodes;
        if (!hollandCodes) {
            const selectedCodes = formData.getAll('hollandCodes[]');
            if (!selectedCodes || selectedCodes.length === 0) {
                throw new Error('Please select at least one Holland Code');
            }
            hollandCodes = selectedCodes;
        }
        
        DEBUG.info('Selected Holland codes:', hollandCodes);
        
        // Convert full Holland code names to single letters
        const convertedCodes = getHollandCodes(hollandCodes);
        DEBUG.info('Converted Holland codes:', convertedCodes);
        
        // Get and display recommendations
        const recommendations = await getCareerRecommendations(mbtiType, convertedCodes);
        await displayRecommendations(recommendations, mbtiType, convertedCodes, formData);
        
        // Get and display training recommendations
        const trainingRecs = getTrainingRecommendations(mbtiType, convertedCodes, formData);
        displayTrainingRecommendations(trainingRecs);
        
        // Add action buttons and scroll to results
        addActionButtons(document.getElementById('results'));
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        DEBUG.error('Error processing form submission:', error);
        showNotification(error.message, 'error');
    }
}

/**
 * Get MBTI type from form data
 * @param {FormData} formData - Form data object
 * @returns {string} MBTI type string
 */
function getMBTIType(formData) {
    // Check if MBTI type is provided in event detail (for auto-fill)
    if (formData.mbtiType) {
        return formData.mbtiType;
    }

    // Otherwise get from form inputs
    const ei = formData.get('ei-preference')?.toUpperCase() || 'X';
    const sn = formData.get('sn-preference')?.toUpperCase() || 'X';
    const tf = formData.get('tf-preference')?.toUpperCase() || 'X';
    const jp = formData.get('jp-preference')?.toUpperCase() || 'X';
    
    return `${ei}${sn}${tf}${jp}`;
}

/**
 * Get career recommendations based on personality assessments
 * @param {string} mbtiType - The MBTI personality type
 * @param {Array<string>} hollandCodes - Array of Holland codes
 * @returns {Array<{title: string, score: number}>} Array of career recommendations with scores
 */
async function getCareerRecommendations(mbtiType, hollandCodes) {
    DEBUG.info('Getting career recommendations for:', { mbtiType, hollandCodes });
    
    // Get all possible MBTI types that match the given type with X wildcards
    const getPossibleTypes = (type) => {
        const positions = [];
        
        // Find positions of 'X' characters
        for (let i = 0; i < type.length; i++) {
            if (type[i] === 'X') positions.push(i);
        }
        
        // If no X's, return just the original type
        if (positions.length === 0) return [type];
        
        // Generate all possible combinations
        const possibilities = ['EI', 'SN', 'TF', 'JP'];
        let combinations = [type];
        
        positions.forEach(pos => {
            const dimensionIndex = Math.floor(pos / 1);
            const dimension = possibilities[dimensionIndex];
            const newCombinations = [];
            
            combinations.forEach(current => {
                dimension.split('').forEach(option => {
                    const chars = current.split('');
                    chars[pos] = option;
                    newCombinations.push(chars.join(''));
                });
            });
            
            combinations = newCombinations;
        });
        
        return combinations.filter(t => !t.includes('X'));
    };

    // Get all matching MBTI types
    const allMatchingTypes = getPossibleTypes(mbtiType);
    DEBUG.info('All possible MBTI types:', allMatchingTypes);

    // Create a map to store career recommendations with their scores
    const recommendationsMap = new Map();

    // Calculate base score for recommendations
    const flexibilityCount = (mbtiType.match(/X/g) || []).length;
    const baseScore = 1 / (flexibilityCount + 1);

    // Gather and score recommendations
    allMatchingTypes.forEach(type => {
        if (careerRecommendations[type]) {
            hollandCodes.forEach(code => {
                if (careerRecommendations[type][code]) {
                    careerRecommendations[type][code].forEach(career => {
                        const currentScore = recommendationsMap.get(career)?.score || 0;
                        const matchScore = baseScore / hollandCodes.length;
                        
                        recommendationsMap.set(career, {
                            title: career,
                            score: currentScore + matchScore,
                            mbtiTypes: [...(recommendationsMap.get(career)?.mbtiTypes || []), type],
                            hollandCodes: [...(recommendationsMap.get(career)?.hollandCodes || []), code]
                        });
                    });
                }
            });
        }
    });

    // Convert map to array and sort by score
    const sortedRecommendations = Array.from(recommendationsMap.values())
        .sort((a, b) => b.score - a.score)
        .map(item => ({
            title: item.title,
            score: item.score,
            matchDetails: {
                mbtiTypes: [...new Set(item.mbtiTypes)],
                hollandCodes: [...new Set(item.hollandCodes)]
            }
        }));

    DEBUG.info('Final sorted recommendations:', sortedRecommendations);
    return sortedRecommendations;
}

/**
 * Convert Holland codes from form data to single-letter codes
 * @param {Array<string>} codes - Array of Holland code strings
 * @returns {Array<string>} Array of single-letter Holland codes
 */
function getHollandCodes(codes) {
    const codeMap = {
        'realistic': 'R',
        'investigative': 'I',
        'artistic': 'A',
        'social': 'S',
        'enterprising': 'E',
        'conventional': 'C'
    };
    
    return codes.map(code => codeMap[code.toLowerCase()] || code);
}

/**
 * Get training recommendations based on MBTI, Holland codes, and experience
 * @param {string} mbtiType - MBTI personality type
 * @param {Array} hollandCodes - Selected Holland codes
 * @param {FormData} formData - Form data
 * @returns {Object} Training recommendations object with general and specific recommendations
 */
function getTrainingRecommendations(mbtiType, hollandCodes, formData) {
    DEBUG.info('Getting training recommendations for:', { mbtiType, hollandCodes });
    
    const generalTraining = {
        'ISTJ': ['Project Management', 'Quality Control', 'Technical Documentation'],
        'ISFJ': ['Safety Management', 'Quality Assurance', 'Resource Planning'],
        'INFJ': ['Environmental Planning', 'Sustainability', 'Team Development'],
        'INTJ': ['Systems Engineering', 'Project Planning', 'Technical Leadership'],
        'ISTP': ['Technical Skills', 'Equipment Operation', 'Problem Solving'],
        'ISFP': ['Design Implementation', 'Material Selection', 'Visual Planning'],
        'INFP': ['Environmental Design', 'Sustainable Practices', 'Creative Solutions'],
        'INTP': ['Technical Analysis', 'Systems Design', 'Research Methods'],
        'ESTP': ['Site Management', 'Team Leadership', 'Emergency Response'],
        'ESFP': ['Team Coordination', 'Client Relations', 'Safety Awareness'],
        'ENFP': ['Business Development', 'Client Engagement', 'Innovation Management'],
        'ENTP': ['Strategic Planning', 'Innovation Leadership', 'Business Strategy'],
        'ESTJ': ['Project Leadership', 'Operations Management', 'Team Management'],
        'ESFJ': ['Team Development', 'Client Service', 'Resource Management'],
        'ENFJ': ['Leadership Development', 'Team Building', 'Communication'],
        'ENTJ': ['Executive Leadership', 'Strategic Management', 'Business Operations']
    };

    const hollandTraining = {
        'realistic': {
            technical: ['Technical Skills Development', 'Equipment Operation', 'Hands-on Construction Methods'],
            soft: ['Technical Problem Solving', 'Spatial Awareness', 'Physical Coordination'],
            certifications: ['Technical Specialist', 'Equipment Operator', 'Construction Technician']
        },
        'investigative': {
            technical: ['Research Methods', 'Data Analysis', 'Technical Documentation'],
            soft: ['Analytical Thinking', 'Research Skills', 'Technical Writing'],
            certifications: ['Research Professional', 'Data Analyst', 'Technical Documentation Specialist']
        },
        'artistic': {
            technical: ['Design Software', 'Creative Solutions', 'Aesthetic Planning'],
            soft: ['Creative Thinking', 'Design Principles', 'Visual Communication'],
            certifications: ['Design Professional', 'Creative Solutions Specialist', 'Visual Design Coordinator']
        },
        'social': {
            technical: ['People Management', 'Training Development', 'Communication Systems'],
            soft: ['Interpersonal Skills', 'Teaching Methods', 'Active Listening'],
            certifications: ['Training Professional', 'Communication Specialist', 'People Management Coordinator']
        },
        'enterprising': {
            technical: ['Business Management', 'Leadership Development', 'Strategic Planning'],
            soft: ['Leadership Skills', 'Persuasion', 'Decision Making'],
            certifications: ['Business Management Professional', 'Leadership Development Specialist', 'Strategic Planning Coordinator']
        },
        'conventional': {
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
    if (generalTraining[mbtiType]) {
        generalTraining[mbtiType].forEach(item => recommendations.technical.add(item));
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

/**
 * Display training recommendations
 * @param {Object} training - Training recommendations object
 */
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
 * Display career recommendations with details and scores
 * @param {Array<{title: string, score: number}>} recommendations - Array of career recommendations with scores
 * @param {string} mbtiType - MBTI personality type
 * @param {Array<string>} hollandCodes - Array of Holland codes
 * @param {FormData} formData - Form data
 */
async function displayRecommendations(recommendations, mbtiType, hollandCodes, formData) {
    try {
        DEBUG.info('Displaying recommendations:', { recommendations, mbtiType, hollandCodes });
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results
        
        if (!recommendations || recommendations.length === 0) {
            resultsDiv.innerHTML = `
                <div class="alert alert-warning">
                    <h4>No Recommendations Found</h4>
                    <p>We couldn't find any career matches for your profile. Try adjusting your preferences or contact us for personalized guidance.</p>
                </div>
            `;
            return;
        }
        
        // Display personality profile summary
        const profileSummary = document.createElement('div');
        profileSummary.className = 'profile-summary mb-4';
        profileSummary.innerHTML = `
            <h3>Your Career Profile</h3>
            <p><strong>MBTI Type:</strong> ${mbtiType}</p>
            <p><strong>Holland Codes:</strong> ${hollandCodes.join(', ') || 'Not specified'}</p>
        `;
        resultsDiv.appendChild(profileSummary);
        
        // Create recommendations container
        const recsContainer = document.createElement('div');
        recsContainer.className = 'recommendations-container';
        
        // Display each recommendation with score and details
        for (const rec of recommendations) {
            try {
                const details = await getCareerInfo(rec.title);
                const recCard = document.createElement('div');
                recCard.className = 'recommendation-card mb-4';
                
                // Calculate match percentage for display
                const matchPercentage = Math.round(rec.score * 100);
                
                recCard.innerHTML = `
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">${rec.title}</h4>
                            <span class="badge ${getMatchBadgeClass(matchPercentage)}">
                                ${matchPercentage}% Match
                            </span>
                        </div>
                        <div class="card-body">
                            ${details ? `
                                <p class="career-description">${details.description || 'No description available'}</p>
                                <div class="career-details">
                                    <h5>Required Education</h5>
                                    <ul>
                                        ${details.education?.degrees?.map(deg => `<li>${deg}</li>`).join('') || '<li>Education requirements not specified</li>'}
                                    </ul>
                                    
                                    <h5>Key Skills</h5>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6>Technical Skills</h6>
                                            <ul>
                                                ${details.skills?.technical?.map(skill => `<li>${skill}</li>`).join('') || '<li>Technical skills not specified</li>'}
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <h6>Soft Skills</h6>
                                            <ul>
                                                ${details.skills?.soft?.map(skill => `<li>${skill}</li>`).join('') || '<li>Soft skills not specified</li>'}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <h5>Salary Range</h5>
                                    <p>Entry Level: ${details.salary?.entry || 'Not specified'}</p>
                                    <p>Mid-Career: ${details.salary?.mid || 'Not specified'}</p>
                                </div>
                            ` : `
                                <div class="alert alert-info">
                                    Detailed information for this career is not available at the moment.
                                </div>
                            `}
                        </div>
                    </div>
                `;
                
                recsContainer.appendChild(recCard);
            } catch (error) {
                DEBUG.error('Error displaying career details:', error);
                // Continue with next recommendation if one fails
                continue;
            }
        }
        
        resultsDiv.appendChild(recsContainer);
        
    } catch (error) {
        DEBUG.error('Error in displayRecommendations:', error);
        document.getElementById('results').innerHTML = `
            <div class="alert alert-danger">
                <h4>Error Displaying Results</h4>
                <p>An error occurred while displaying your career recommendations. Please try again or contact support if the problem persists.</p>
            </div>
        `;
    }
}

/**
 * Get the appropriate badge class based on match percentage
 * @param {number} percentage - Match percentage
 * @returns {string} Bootstrap badge class
 */
function getMatchBadgeClass(percentage) {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-primary';
    if (percentage >= 40) return 'bg-info';
    if (percentage >= 20) return 'bg-warning';
    return 'bg-secondary';
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

// Make applyForPosition available globally
window.applyForPosition = applyForPosition;

const careerRecommendations = {
    'ISTJ': {
        'R': ['Construction Project Manager', 'Site Supervisor', 'Safety Inspector'],
        'I': ['Structural Engineer', 'Civil Engineer', 'Building Inspector'],
        'C': ['Construction Estimator', 'Quality Control Manager', 'Building Code Inspector']
    },
    'ISFJ': {
        'S': ['Safety Manager', 'Quality Control Inspector', 'Construction Administrator'],
        'C': ['Document Controller', 'Project Coordinator', 'Administrative Manager']
    },
    'INFJ': {
        'S': ['Sustainability Consultant', 'Environmental Specialist', 'Training Coordinator'],
        'A': ['BIM Specialist', 'Design Coordinator', 'Interior Designer']
    },
    'INTJ': {
        'I': ['Civil Engineer', 'Structural Engineer', 'Project Controls Manager'],
        'A': ['BIM Specialist', 'Construction Technology Specialist', 'Systems Architect']
    },
    'ISTP': {
        'R': ['Heavy Equipment Operator', 'Construction Foreman', 'Mechanical Technician'],
        'I': ['Building Systems Technician', 'Equipment Maintenance Specialist', 'Field Engineer']
    },
    'ISFP': {
        'A': ['Interior Designer', 'Landscape Designer', 'Architectural Drafter'],
        'R': ['Skilled Tradesperson', 'Renovation Specialist', 'Site Technician']
    },
    'INFP': {
        'S': ['Environmental Consultant', 'Sustainability Specialist', 'Community Relations Manager'],
        'A': ['Architectural Designer', 'Design Consultant', 'Space Planning Specialist']
    },
    'INTP': {
        'I': ['Structural Engineer', 'Building Systems Engineer', 'Construction Software Developer'],
        'A': ['BIM Specialist', 'Virtual Design Coordinator', 'Technical Architect']
    },
    'ESTP': {
        'R': ['Construction Foreman', 'Site Supervisor', 'Equipment Manager'],
        'E': ['Business Development Manager', 'Sales Manager', 'Operations Manager']
    },
    'ESFP': {
        'E': ['Real Estate Developer', 'Sales Representative', 'Client Relations Manager'],
        'S': ['Safety Coordinator', 'Training Specialist', 'Community Liaison']
    },
    'ENFP': {
        'E': ['Client Relations Director', 'Business Development Director', 'Marketing Manager'],
        'S': ['Training Director', 'Public Relations Manager', 'Community Engagement Specialist']
    },
    'ENTP': {
        'E': ['Innovation Director', 'Strategy Consultant', 'Business Development Manager'],
        'I': ['Construction Technology Specialist', 'Systems Integration Manager', 'Process Improvement Specialist']
    },
    'ESTJ': {
        'E': ['Construction Operations Manager', 'Project Director', 'General Contractor'],
        'C': ['Quality Assurance Manager', 'Compliance Manager', 'Operations Director']
    },
    'ESFJ': {
        'S': ['Human Resources Manager', 'Training Coordinator', 'Safety Director'],
        'E': ['Client Relations Manager', 'Team Lead', 'Operations Supervisor']
    },
    'ENFJ': {
        'S': ['Training Director', 'Human Resources Director', 'Community Relations Manager'],
        'E': ['Business Development Director', 'Regional Manager', 'Operations Director']
    },
    'ENTJ': {
        'E': ['Construction Company CEO', 'Executive Director', 'Strategic Operations Manager'],
        'I': ['Technical Director', 'Innovation Strategy Manager', 'Systems Integration Director']
    },
    'ENFJ': {
        'S': [
            'Training Director',
            'HR Director',
            'Client Relations Director'
        ],
        'E': [
            'Construction Project Manager',
            'Construction Superintendent',
            'Site Supervisor'
        ],
        'C': [
            'Safety Director',
            'Construction Estimator'
        ]
    },
    'ENFP': {
        'S': [
            'Training Director',
            'HR Director',
            'Client Relations Director'
        ],
        'E': [
            'Construction Project Manager',
            'Site Supervisor'
        ],
        'A': [
            'Construction Estimator',
            'Safety Director'
        ]
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
            'project-management': [
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
            'project-management': [
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
            'project-management': [
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

/**
 * Initialize form mode controls
 */
function initializeFillModeControls() {
    const fillModeToggle = document.getElementById('fillModeToggle');
    const form = document.getElementById('careerForm');
    
    // Initialize state
    CONFIG.AUTO_FILL_MODE = fillModeToggle.checked;
    updateFormMode();
    
    // Handle toggle changes
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
}

/**
 * Update form based on current fill mode
 */
function updateFormMode() {
    const form = document.getElementById('careerForm');
    const inputs = form.querySelectorAll('input:not(#fillModeToggle), select, textarea');
    
    if (CONFIG.AUTO_FILL_MODE) {
        // Store original required state and disable inputs
        inputs.forEach(input => {
            input.setAttribute('data-original-required', input.required);
            input.required = false;
            input.disabled = true;
        });
        
        showNotification('Auto-fill mode enabled. Form will be filled automatically.', 'info');
    } else {
        // Restore original required state and enable inputs
        inputs.forEach(input => {
            const originalRequired = input.getAttribute('data-original-required');
            if (originalRequired !== null) {
                input.required = originalRequired === 'true';
            }
            input.disabled = false;
        });
        
        showNotification('Manual fill mode enabled. Please fill out the form manually.', 'info');
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        DEBUG.info('Initializing application');
        initializeForm();
        initializeFillModeControls();
    } catch (error) {
        DEBUG.error('Error during initialization:', error);
        showNotification('Error initializing application. Please refresh the page.', 'error');
    }
});

// Export functions for use in other modules
export {
    initializeForm,
    getCareerRecommendations,
    getHollandCodes,
    getMBTIType,
    displayRecommendations,
    displayTrainingRecommendations,
    saveCareer,
    applyForPosition
};

// Make certain functions available globally
window.saveCareer = saveCareer;
window.applyForPosition = applyForPosition;