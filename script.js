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

function displayRecommendations(recommendations, mbtiType, hollandCodes, formData) {
    try {
        DEBUG.info('Displaying recommendations:', recommendations);
        
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results
        
        recommendations.forEach(career => {
            DEBUG.info('Processing career object:', career);
            
            try {
                const careerTitle = career.title ? String(career.title) : '';
                DEBUG.info('Career title:', careerTitle);
                
                const careerPath = determineCareerPath(careerTitle);
                const training = getTrainingRecommendations(mbtiType, hollandCodes, formData);
                
                const card = document.createElement('div');
                card.className = 'card mb-4';
                
                // Create card content...
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                // Title
                const title = document.createElement('h3');
                title.className = 'card-title';
                title.textContent = careerTitle;
                cardBody.appendChild(title);
                
                // Overview
                const overview = document.createElement('div');
                overview.className = 'mb-4';
                overview.innerHTML = `
                    <h4>Overview</h4>
                    <p>${career.description || `Specialized role combining ${mbtiType} personality traits with ${hollandCodes.join('/')} interests.`}</p>
                `;
                cardBody.appendChild(overview);
                
                // Key Responsibilities
                const responsibilities = document.createElement('div');
                responsibilities.className = 'mb-4';
                responsibilities.innerHTML = `
                    <h4>Key Responsibilities</h4>
                    ${(career.responsibilities || [
                        'Lead and coordinate construction projects',
                        'Implement industry best practices',
                        'Manage teams and resources',
                        'Drive project success'
                    ]).map(resp => `<p>✅ ${resp}</p>`).join('')}
                `;
                cardBody.appendChild(responsibilities);
                
                // Required Skills
                const skills = document.createElement('div');
                skills.className = 'mb-4';
                skills.innerHTML = `
                    <h4>Required Skills</h4>
                    ${(career.skills || [
                        'Advanced technical knowledge',
                        'Leadership abilities',
                        'Project management',
                        'Problem-solving'
                    ]).map(skill => `<p>⭐ ${skill}</p>`).join('')}
                `;
                cardBody.appendChild(skills);
                
                // Education & Training
                const education = document.createElement('div');
                education.className = 'mb-4';
                education.innerHTML = `
                    <h4>Education & Training</h4>
                    <p>${career.education || 'Bachelor\'s degree in Construction Management or related field preferred'}</p>
                    ${career.certifications ? `<p>Recommended certifications: ${career.certifications}</p>` : ''}
                `;
                cardBody.appendChild(education);
                
                // Training Recommendations
                const trainingSection = displayTrainingRecommendations(training);
                cardBody.appendChild(trainingSection);
                
                // Salary Range
                const salary = document.createElement('div');
                salary.innerHTML = `
                    <h4>Salary Range</h4>
                    <p>💰 Starting: ${career.salaryRange?.starting || '$60,000 - $80,000'}</p>
                    <p>💰 Experienced: ${career.salaryRange?.experienced || '$90,000 - $120,000'}</p>
                `;
                cardBody.appendChild(salary);
                
                card.appendChild(cardBody);
                resultsDiv.appendChild(card);
                
            } catch (error) {
                DEBUG.error('Error processing career:', error);
            }
        });
        
    } catch (error) {
        DEBUG.error('Error displaying recommendations:', error);
    }
}

/**
 * Determine the career path category based on job title
 * @param {string} title - Job title
 * @returns {string} Career path category
 */
function determineCareerPath(title) {
    try {
        // Debug the input
        DEBUG.info('determineCareerPath input:', title, typeof title);
        
        // Handle null/undefined/non-string input
        if (!title || typeof title !== 'string') {
            DEBUG.warn('Invalid title input:', title);
            return 'skilled_trades';
        }
        
        // Convert to string and lowercase
        const safeTitle = title.toLowerCase();
        DEBUG.info('Title after conversion:', safeTitle);
        
        if (safeTitle.includes('manager') || safeTitle.includes('coordinator')) {
            return 'project_management';
        } else if (safeTitle.includes('engineer') || safeTitle.includes('architect')) {
            return 'engineering';
        } else if (safeTitle.includes('supervisor') || safeTitle.includes('foreman')) {
            return 'supervision';
        } else {
            return 'skilled_trades';
        }
    } catch (error) {
        DEBUG.error('Error determining career path:', error, { title });
        return 'skilled_trades'; // Default to skilled trades if there's an error
    }
}

/**
 * Generate and download results as PDF
 */
async function saveAsPDF() {
    const element = document.getElementById('results');
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
    } catch (error) {
        DEBUG.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
    }
}

/**
 * Print the results
 */
function printResults() {
    try {
        window.print();
        DEBUG.info('Print dialog opened successfully');
    } catch (error) {
        DEBUG.error('Error opening print dialog:', error);
        alert('There was an error opening the print dialog. Please try again.');
    }
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

                if (!mbtiType || mbtiType.length !== 4) {
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
    
    // Career recommendations based on MBTI and Holland codes
    const recommendations = {
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

    const defaultRecommendations = [{
        title: 'Construction Professional',
        description: 'Join the exciting field of construction with opportunities for growth and development.',
        responsibilities: [
            'Contribute to construction projects',
            'Learn industry best practices',
            'Work with experienced professionals',
            'Develop technical skills'
        ],
        skills: [
            'Basic construction knowledge',
            'Safety awareness',
            'Team collaboration',
            'Problem-solving'
        ],
        education: 'High school diploma or equivalent',
        yearsExperience: 0,
        careerPath: 'Start in entry-level positions with opportunities to advance based on experience and certifications.',
        salaryRange: {
            starting: '$45,000 - $60,000',
            experienced: '$70,000 - $100,000'
        }
    }];

    try {
        // Get MBTI specific recommendations
        const mbtiRecommendations = recommendations[mbtiType] || {};
        DEBUG.info('MBTI recommendations:', mbtiRecommendations);

        // Filter by Holland codes
        const matchingCareers = [];
        hollandCodes.forEach(code => {
            if (mbtiRecommendations[code]) {
                const careers = mbtiRecommendations[code].map(title => ({
                    title,
                    description: `Specialized role combining ${mbtiType} personality traits with ${code} interests.`,
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
                    yearsExperience: 2,
                    careerPath: 'Opportunities for advancement to senior positions with experience.',
                    salaryRange: {
                        starting: '$60,000 - $80,000',
                        experienced: '$90,000 - $120,000'
                    }
                }));
                matchingCareers.push(...careers);
            }
        });

        DEBUG.info('Matching careers:', matchingCareers);
        return matchingCareers.length > 0 ? matchingCareers : defaultRecommendations;
    } catch (error) {
        DEBUG.error('Error getting career recommendations:', error);
        return defaultRecommendations;
    }
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
    
    const recommendations = {
        general: [
            'OSHA 30-Hour Construction Safety Course',
            'Advanced Blueprint Reading',
            'Construction Quality Control',
            'Risk Management Basics',
            'Construction Contract Fundamentals'
        ],
        specific: []
    };

    // MBTI-based recommendations
    const mbtiRecommendations = {
        // Analysts (NT)
        'INTJ': ['BIM Software Certification', 'Advanced Project Planning', 'Strategic Management'],
        'INTP': ['Construction Technology Integration', 'Data Analytics for Construction', 'Innovation Management'],
        'ENTJ': ['Executive Leadership Program', 'Strategic Business Development', 'Advanced Negotiation Skills'],
        'ENTP': ['Innovation in Construction Methods', 'Creative Problem-Solving', 'Emerging Technologies'],
        
        // Diplomats (NF)
        'INFJ': ['Sustainable Construction Practices', 'Team Development', 'Conflict Resolution'],
        'INFP': ['Environmental Impact Assessment', 'Green Building Certification', 'Workplace Wellness'],
        'ENFJ': ['Leadership Development', 'Team Building', 'Communication Skills'],
        'ENFP': ['Client Relations Management', 'Creative Design Solutions', 'Stakeholder Engagement'],
        
        // Sentinels (SJ)
        'ISTJ': ['Quality Management Systems', 'Construction Law', 'Technical Documentation'],
        'ISFJ': ['Safety Management Systems', 'Risk Assessment', 'Quality Assurance'],
        'ESTJ': ['Project Management Professional (PMP)', 'Contract Administration', 'Operations Management'],
        'ESFJ': ['Team Coordination', 'Client Service Excellence', 'HR Management'],
        
        // Explorers (SP)
        'ISTP': ['Advanced Equipment Operation', 'Technical Specialization', 'Hands-on Skills Development'],
        'ISFP': ['Design Implementation', 'Aesthetic Planning', 'Material Selection'],
        'ESTP': ['Site Management', 'Crisis Management', 'Dynamic Problem-Solving'],
        'ESFP': ['On-site Coordination', 'Team Motivation', 'Public Relations']
    };

    // Holland Code based recommendations
    const hollandRecommendations = {
        'R': ['Equipment Operation Certification', 'Technical Skills Training', 'Hands-on Construction Methods'],
        'I': ['Construction Research Methods', 'Advanced Technical Analysis', 'Problem-Solving Methodologies'],
        'A': ['Design Software Certification', 'Creative Solutions Workshop', 'Architectural Visualization'],
        'S': ['Team Leadership Training', 'Safety Training Certification', 'Communication Skills Development'],
        'E': ['Business Development', 'Sales and Marketing in Construction', 'Entrepreneurship in Construction'],
        'C': ['Project Controls', 'Quality Control Systems', 'Documentation Management']
    };

    // Add MBTI-specific recommendations
    if (mbtiType && mbtiRecommendations[mbtiType]) {
        recommendations.specific.push(...mbtiRecommendations[mbtiType]);
    }

    // Add Holland Code specific recommendations
    hollandCodes.forEach(code => {
        if (hollandRecommendations[code]) {
            recommendations.specific.push(...hollandRecommendations[code]);
        }
    });

    // Add experience-based recommendations
    const experience = formData.get('constructionExperience');
    if (experience) {
        const expLevel = parseInt(experience);
        if (expLevel === 0) {
            recommendations.specific.push(
                'Construction Basics Training',
                'Industry Terminology Workshop',
                'Entry-level Safety Certification'
            );
        } else if (expLevel >= 5) {
            recommendations.specific.push(
                'Advanced Project Management',
                'Leadership and Team Management',
                'Strategic Planning in Construction'
            );
        }
    }

    // Remove duplicates and limit to most relevant
    recommendations.specific = [...new Set(recommendations.specific)].slice(0, 8);
    
    DEBUG.info('Generated training recommendations:', recommendations);
    return recommendations;
}

/**
 * Display training recommendations in the UI
 * @param {Object} recommendations - Training recommendations object
 */
function displayTrainingRecommendations(recommendations) {
    const trainingDiv = document.createElement('div');
    trainingDiv.className = 'mb-5';
    trainingDiv.innerHTML = `
        <h3>Recommended Training & Certifications</h3>
        
        <div class="training-section mb-4">
            <h4 class="h5 mb-3">Essential Training for All Construction Professionals</h4>
            ${recommendations.general.map(item => `
                <p><span class="text-primary me-2">🔷</span>${item}</p>
            `).join('')}
        </div>

        ${recommendations.specific.length > 0 ? `
            <div class="training-section">
                <h4 class="h5 mb-3">Personalized Training Path</h4>
                ${recommendations.specific.map(item => `
                    <p><span class="text-success me-2">🎯</span>${item}</p>
                `).join('')}
            </div>
        ` : ''}
    `;
    return trainingDiv;
}