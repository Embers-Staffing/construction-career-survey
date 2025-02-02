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
    },
    trainingResources: {
        technical: [
            {
                name: "Construction Management Basics",
                provider: "Coursera",
                url: "https://www.coursera.org/construction-management",
                duration: "6 weeks",
                cost: "Free to audit"
            },
            {
                name: "BIM Fundamentals",
                provider: "LinkedIn Learning",
                url: "https://www.linkedin.com/learning/bim-fundamentals",
                duration: "4 weeks",
                cost: "$49.99/month"
            },
            {
                name: "OSHA Safety Certification",
                provider: "OSHA Training Institute",
                url: "https://www.osha.gov/training",
                duration: "30 hours",
                cost: "$179"
            }
        ],
        leadership: [
            {
                name: "Construction Leadership Institute",
                provider: "AGC",
                url: "https://www.agc.org/leadership",
                duration: "12 weeks",
                cost: "Varies"
            },
            {
                name: "Project Management Professional (PMP)",
                provider: "PMI",
                url: "https://www.pmi.org/certifications/project-management-pmp",
                duration: "Self-paced",
                cost: "$555 for exam"
            }
        ],
        technology: [
            {
                name: "Construction Tech Stack",
                provider: "Udemy",
                url: "https://www.udemy.com/construction-tech",
                duration: "8 weeks",
                cost: "$199"
            },
            {
                name: "Digital Construction Certificate",
                provider: "Autodesk",
                url: "https://www.autodesk.com/certification",
                duration: "Self-paced",
                cost: "$250"
            }
        ]
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

function getRecommendedTraining(role, experience) {
    const skillLevel = experience < 2 ? 'entry' : experience < 5 ? 'mid' : 'senior';
    let recommendations = [];
    
    // Add technical training based on role
    recommendations.push(...CAREER_DATA.trainingResources.technical
        .filter(course => !course.level || course.level === skillLevel || course.level === 'all')
        .map(course => ({
            ...course,
            category: 'Technical Training'
        }))
    );

    // Add leadership training for experienced professionals
    if (experience >= 2) {
        recommendations.push(...CAREER_DATA.trainingResources.leadership
            .map(course => ({
                ...course,
                category: 'Leadership Development'
            }))
        );
    }

    // Add technology training
    recommendations.push(...CAREER_DATA.trainingResources.technology
        .map(course => ({
            ...course,
            category: 'Technology Skills'
        }))
    );

    return recommendations;
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        DEBUG.info('Initializing application');
        
        // Use the singleton instance
        const recommendationService = careerRecommendationService;
        
        // Initialize form elements
        const form = document.getElementById('careerForm');
        const yearSelect = document.querySelector('select[name="birthYear"]');
        const monthSelect = document.querySelector('select[name="birthMonth"]');
        const ageDisplay = document.querySelector('.age-display');
        const hollandCodeCheckboxes = document.querySelectorAll('.holland-code');

        if (!form || !yearSelect || !monthSelect) {
            console.error('Required form elements not found', {
                form: !!form,
                yearSelect: !!yearSelect,
                monthSelect: !!monthSelect
            });
            return;
        }

        // Add notification utility
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

        // Initialize years
        const currentYear = new Date().getFullYear();
        yearSelect.innerHTML = '<option value="">Select Year</option>';
        for (let year = currentYear - CONFIG.MIN_AGE; year >= currentYear - CONFIG.MAX_AGE; year--) {
            const option = document.createElement('option');
            option.value = year.toString(); // Ensure year is a string
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        // Add event listeners for age calculation
        function updateAge() {
            const year = parseInt(yearSelect.value); // Parse year as integer
            const month = parseInt(monthSelect.value); // Parse month as integer
            
            if (!isNaN(year) && !isNaN(month) && ageDisplay) {
                const today = new Date();
                const birthDate = new Date(year, month - 1);
                let age = today.getFullYear() - birthDate.getFullYear();
                
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                
                ageDisplay.textContent = `Age: ${age} years old`;
                ageDisplay.style.display = 'block';
                DEBUG.debug('Age calculated:', { year, month, age });
            } else {
                if (ageDisplay) {
                    ageDisplay.style.display = 'none';
                }
                DEBUG.debug('Invalid age inputs:', { year, month });
            }
        }

        yearSelect.addEventListener('change', updateAge);
        monthSelect.addEventListener('change', updateAge);

        DEBUG.info('Date selectors initialized successfully');
        
        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                DEBUG.info('Form submitted, processing...');
                
                // Get form data
                const formData = new FormData(form);
                
                // Process Holland Code selections
                const hollandCodeSelections = Array.from(document.querySelectorAll('.holland-code:checked'))
                    .map(checkbox => checkbox.value.charAt(0).toUpperCase())
                    .sort()
                    .join('');

                // Create result object
                const result = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    age: calculateAge(parseInt(formData.get('birthYear')), parseInt(formData.get('birthMonth'))),
                    constructionExperience: formData.get('constructionExperience'),
                    mbtiType: getMBTIType(formData),
                    hollandCode: hollandCodeSelections,
                    environmentPreference: formData.get('environmentComfort'),
                    technicalSkills: Array.from(formData.getAll('technicalSkills')),
                    certifications: Array.from(formData.getAll('certifications')),
                    travelPreference: formData.get('travelPreference'),
                    techInterests: Array.from(formData.getAll('techInterests')),
                    careerGoals: formData.get('careerGoals'),
                    additionalInfo: formData.get('additionalInfo')
                };

                // Get recommendations from Firebase
                const recommendations = await recommendationService.getRecommendations(
                    result.hollandCode,
                    result.mbtiType
                );

                // Store survey response with recommendations
                await recommendationService.storeSurveyResponse(result, recommendations);

                // Show results
                const resultsDiv = document.getElementById('results');
                const resultsContent = document.getElementById('resultsContent');
                
                if (!resultsDiv || !resultsContent) {
                    throw new Error('Results elements not found');
                }

                // Get recommendations data safely
                const hollandRecommendations = recommendations?.hollandCode || {};
                const mbtiRecommendations = recommendations?.mbti || {};

                // Generate and display results HTML
                resultsContent.innerHTML = `
                    <div class="career-path mb-4">
                        <h3>Personal Profile</h3>
                        <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                        <p><strong>Age:</strong> ${result.age}</p>
                        <p><strong>Construction Experience:</strong> ${result.constructionExperience}</p>
                        <p><strong>MBTI Type:</strong> ${result.mbtiType} - ${getMBTIDescription(result.mbtiType)}</p>
                        <p><strong>Holland Code:</strong> ${result.hollandCode}</p>
                    </div>

                    <div class="recommendations mb-4">
                        <h3>Career Recommendations</h3>
                        ${hollandRecommendations.jobs ? `
                            <div class="mb-3">
                                <h4>Based on Your Holland Code (${result.hollandCode}):</h4>
                                <p>${hollandRecommendations.description || ''}</p>
                                <ul>
                                    ${hollandRecommendations.jobs.map(job => `<li>${job}</li>`).join('')}
                                </ul>
                            </div>
                        ` : '<p>No specific Holland Code recommendations available yet.</p>'}

                        ${mbtiRecommendations.jobs ? `
                            <div class="mb-3">
                                <h4>Based on Your MBTI Type (${result.mbtiType}):</h4>
                                <p>${mbtiRecommendations.description || ''}</p>
                                <ul>
                                    ${mbtiRecommendations.jobs.map(job => `<li>${job}</li>`).join('')}
                                </ul>
                            </div>
                        ` : '<p>No specific MBTI recommendations available yet.</p>'}
                    </div>

                    <div class="skills-match mb-4">
                        <h3>Skills Analysis</h3>
                        <p><strong>Current Technical Skills:</strong></p>
                        <ul>
                            ${result.technicalSkills.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                        
                        <p><strong>Interested in Construction Technologies:</strong></p>
                        <ul>
                            ${result.techInterests.map(tech => `<li>${tech}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="career-progression mb-4">
                        <h3>Career Progression</h3>
                        <p><strong>Recommended Career Path:</strong></p>
                        <ul>
                            ${getCareerProgression(result.hollandCode, result.constructionExperience).map(step => `
                                <li>
                                    <strong>${step.level}</strong> (${step.years})
                                    <br>Salary Range: $${step.salary.min.toLocaleString()} - $${step.salary.max.toLocaleString()}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="recommended-training mb-4">
                        <h3>Recommended Training</h3>
                        ${getRecommendedTraining(result.hollandCode, result.constructionExperience)
                            .reduce((acc, course) => {
                                if (!acc[course.category]) {
                                    acc[course.category] = [];
                                }
                                acc[course.category].push(course);
                                return acc;
                            }, {})
                            .map((courses, category) => `
                                <div class="mb-3">
                                    <h4>${category}</h4>
                                    <ul>
                                        ${courses.map(course => `
                                            <li>
                                                <strong>${course.name}</strong>
                                                <br>Provider: ${course.provider}
                                                <br>Duration: ${course.duration}
                                                <br>Cost: ${course.cost}
                                                ${course.url ? `<br><a href="${course.url}" target="_blank">Learn More</a>` : ''}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                    </div>
                `;
                // Show results section and scroll
                resultsDiv.style.display = 'block';
                resultsDiv.scrollIntoView({ behavior: 'smooth' });
                
                DEBUG.info('Results displayed successfully');
                
            } catch (error) {
                DEBUG.error('Error processing form:', error);
                showNotification('There was an error processing your information. Please try again.', 'error');
            }
        });

        // Helper function to get MBTI type
        function getMBTIType(formData) {
            return (formData.get('mbtiEI') || '') +
                   (formData.get('mbtiSN') || '') +
                   (formData.get('mbtiTF') || '') +
                   (formData.get('mbtiJP') || '');
        }

        // Helper function to calculate age
        function calculateAge(year, month) {
            const today = new Date();
            const birthDate = new Date(year, month - 1);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        }

        // Add helper functions for recommendations
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

        function getTrainingRecommendations(result) {
            const recommendations = [];

            // Basic safety training
            recommendations.push(
                "OSHA Construction Safety Certification",
                "First Aid and CPR Training"
            );

            // Experience-based recommendations
            if (result.constructionExperience === 'none') {
                recommendations.push(
                    "Introduction to Construction Methods",
                    "Basic Tool Safety Training",
                    "Construction Math Fundamentals"
                );
            } else if (result.constructionExperience === 'beginner') {
                recommendations.push(
                    "Advanced Safety Training",
                    "Equipment Operation Certification",
                    "Project Management Basics"
                );
            } else {
                recommendations.push(
                    "Leadership and Supervision Training",
                    "Advanced Project Management",
                    "Construction Business Management"
                );
            }

            // Add technical skill recommendations
            if (result.technicalSkills && result.technicalSkills.length > 0) {
                result.technicalSkills.forEach(skill => {
                    recommendations.push(`Advanced training in ${skill}`);
                });
            }

            // Add technology-focused training
            if (result.techInterests && result.techInterests.length > 0) {
                result.techInterests.forEach(tech => {
                    recommendations.push(`Certification in ${tech}`);
                });
            }

            return recommendations;
        }

        // Add personality type description utilities
        const HOLLAND_TRAITS = {
            'R': 'Realistic (hands-on, practical)',
            'I': 'Investigative (analytical, intellectual)',
            'A': 'Artistic (creative, innovative)',
            'S': 'Social (helpful, cooperative)',
            'E': 'Enterprising (persuasive, leadership)',
            'C': 'Conventional (orderly, detail-oriented)'
        };

        const MBTI_TRAITS = {
            'E': 'Extroverted',
            'I': 'Introverted',
            'S': 'Sensing',
            'N': 'Intuitive',
            'T': 'Thinking',
            'F': 'Feeling',
            'J': 'Judging',
            'P': 'Perceiving'
        };

        const MBTI_DESCRIPTIONS = {
            'ENFP': 'Extroverted, Intuitive, Feeling, Perceiving - Creative and enthusiastic innovators who excel at inspiring and connecting with others',
            'ENFJ': 'Extroverted, Intuitive, Feeling, Judging - Natural leaders who are passionate about developing people and driving positive change',
            'ENTJ': 'Extroverted, Intuitive, Thinking, Judging - Strategic leaders who excel at organizing people and resources to achieve goals',
            'ENTP': 'Extroverted, Intuitive, Thinking, Perceiving - Quick-thinking innovators who enjoy solving complex problems',
            'ESFJ': 'Extroverted, Sensing, Feeling, Judging - Supportive team players who value harmony and practical solutions',
            'ESFP': 'Extroverted, Sensing, Feeling, Perceiving - Action-oriented team players who bring enthusiasm to hands-on work',
            'ESTJ': 'Extroverted, Sensing, Thinking, Judging - Practical organizers who excel at implementing structured plans',
            'ESTP': 'Extroverted, Sensing, Thinking, Perceiving - Action-oriented problem solvers who thrive in dynamic environments',
            'INFJ': 'Introverted, Intuitive, Feeling, Judging - Insightful planners who are driven by their values and vision',
            'INFP': 'Introverted, Intuitive, Feeling, Perceiving - Thoughtful idealists who care deeply about personal growth',
            'INTJ': 'Introverted, Intuitive, Thinking, Judging - Strategic thinkers who excel at developing innovative solutions',
            'INTP': 'Introverted, Intuitive, Thinking, Perceiving - Analytical problem solvers who enjoy theoretical challenges',
            'ISFJ': 'Introverted, Sensing, Feeling, Judging - Detail-oriented supporters who value tradition and stability',
            'ISFP': 'Introverted, Sensing, Feeling, Perceiving - Artistic contributors who bring creativity to practical work',
            'ISTJ': 'Introverted, Sensing, Thinking, Judging - Reliable executors who excel at maintaining order and standards',
            'ISTP': 'Introverted, Sensing, Thinking, Perceiving - Practical problem solvers who excel in technical roles'
        };

        function getMBTIDescription(type) {
            return MBTI_DESCRIPTIONS[type] || 'Description not available';
        }

        function getHollandCodeDescription(code) {
            if (!code) return '';
            return code.split('').map(letter => HOLLAND_TRAITS[letter]).join(' + ');
        }

        function getRecommendedTraining(role, experience) {
            const skillLevel = experience < 2 ? 'entry' : experience < 5 ? 'mid' : 'senior';
            let recommendations = [];
            
            // Add technical training based on role
            recommendations.push(...CAREER_DATA.trainingResources.technical
                .filter(course => !course.level || course.level === skillLevel || course.level === 'all')
                .map(course => ({
                    ...course,
                    category: 'Technical Training'
                }))
            );

            // Add leadership training for experienced professionals
            if (experience >= 2) {
                recommendations.push(...CAREER_DATA.trainingResources.leadership
                    .map(course => ({
                        ...course,
                        category: 'Leadership Development'
                    }))
                );
            }

            // Add technology training
            recommendations.push(...CAREER_DATA.trainingResources.technology
                .map(course => ({
                    ...course,
                    category: 'Technology Skills'
                }))
            );

            return recommendations;
        }

        // Update displayResults function to include descriptions
        function displayResults(result, recommendations) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title">Your Profile</h3>
                        <p><strong>Holland Code:</strong> ${result.hollandCode} <br>
                           <em class="text-muted">${getHollandCodeDescription(result.hollandCode)}</em></p>
                        <p><strong>MBTI Type:</strong> ${result.mbtiType} <br>
                           <em class="text-muted">${getMBTIDescription(result.mbtiType)}</em></p>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title">Recommended Roles</h3>
                        <div class="mb-4">
                            <h5>Based on Your Holland Code (${result.hollandCode})</h5>
                            ${recommendations.hollandCode ? `
                                <p class="text-muted">${recommendations.hollandCode.description}</p>
                                <ul class="list-unstyled">
                                    ${recommendations.hollandCode.jobs.map(job => `<li>• ${job}</li>`).join('')}
                                </ul>
                            ` : '<p>No specific recommendations available for this code combination.</p>'}
                        </div>
                        <div>
                            <h5>Based on Your MBTI Type (${result.mbtiType})</h5>
                            ${recommendations.mbti ? `
                                <p class="text-muted">${recommendations.mbti.description}</p>
                                <ul class="list-unstyled">
                                    ${recommendations.mbti.jobs.map(job => `<li>• ${job}</li>`).join('')}
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
                            ${getRecommendedTraining(result.hollandCode, result.constructionExperience).map(rec => `<li>• ${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Initialization failed:', error);
    }
}); 