'use strict';

import { CareerRecommendationService } from './firebase.js';

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

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        DEBUG.info('Initializing application');
        
        // Initialize recommendation service
        const recommendationService = new CareerRecommendationService();
        
        // Initialize form elements
        const form = document.getElementById('careerForm');
        const yearSelect = document.querySelector('select[name="birth-year"]');
        const monthSelect = document.querySelector('select[name="birth-month"]');
        const ageDisplay = document.querySelector('.age-display');

        if (!form || !yearSelect || !monthSelect) {
            console.error('Required form elements not found');
            return;
        }

        // Initialize years
        const currentYear = new Date().getFullYear();
        yearSelect.innerHTML = '<option value="">Select Year</option>';
        for (let i = currentYear - CONFIG.MIN_AGE; i >= currentYear - CONFIG.MAX_AGE; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }

        // Add event listeners for age calculation
        function updateAge() {
            const year = yearSelect.value;
            const month = monthSelect.value;
            
            if (year && month && ageDisplay) {
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
                const formData = new FormData(form);
                
                // Create result object
                const result = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    age: calculateAge(formData.get('birth-year'), formData.get('birth-month')),
                    constructionExperience: formData.get('constructionExperience'),
                    mbtiType: getMBTIType(formData),
                    hollandCode: formData.getAll('holland').join(''),
                    careerInterests: formData.getAll('career-interests'),
                    techInterests: formData.getAll('tech-interests'),
                    environment: formData.get('environment-comfort'),
                    travelWillingness: formData.get('travel-willingness'),
                    skills: formData.getAll('skills'),
                    careerGoals: formData.getAll('career-goals'),
                    salaryTarget: formData.get('salary-target'),
                    advancementPreference: formData.get('advancement-preference'),
                    mentorshipType: formData.get('mentorship-type')
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

                // Generate and display results HTML
                resultsContent.innerHTML = `
                    <div class="career-path mb-4">
                        <h3>Personal Profile</h3>
                        <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                        <p><strong>Age:</strong> ${result.age}</p>
                        <p><strong>Experience:</strong> ${result.constructionExperience} years</p>
                        <p><strong>MBTI Type:</strong> ${result.mbtiType}</p>
                        <p><strong>Holland Code:</strong> ${result.hollandCode}</p>
                        <p><strong>Work Environment:</strong> ${result.environment}</p>
                    </div>

                    <div class="career-path mb-4">
                        <h3>Your Personality Profile</h3>
                        <div class="mb-4">
                            <h4>Holland Code Analysis</h4>
                            <p>${recommendations.hollandCodeDescription}</p>
                        </div>
                        <div class="mb-4">
                            <h4>MBTI Analysis</h4>
                            <p>${recommendations.mbtiDescription}</p>
                        </div>
                    </div>

                    <div class="career-path mb-4">
                        <h3>Recommended Career Paths</h3>
                        <div class="recommendations">
                            ${recommendations.jobs.map(job => `
                                <div class="recommendation-card mb-3">
                                    <h4>${job}</h4>
                                    <div class="career-details">
                                        <p><strong>Salary Range:</strong> ${getSalaryRange(job)}</p>
                                        <p><strong>Required Skills:</strong> ${getRequiredSkills(job).join(', ')}</p>
                                        <p><strong>Career Growth:</strong> ${getCareerGrowth(job)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="careerFlowchart" class="career-path mb-4">
                        <h3>Career Progression Paths</h3>
                        <div class="career-flowchart">
                            ${recommendations.jobs.slice(0, 3).map(job => `
                                <div class="career-progression-track">
                                    <h4 class="mb-3">${job} Track</h4>
                                    <div class="progression-steps">
                                        ${getProgressionSteps(job).map((step, index) => `
                                            <div class="progression-step">
                                                <div class="step-content">
                                                    <h5>${step.title}</h5>
                                                    <p class="salary">${step.salary}</p>
                                                    <div class="timeframe">Typical timeframe: ${step.timeframe}</div>
                                                </div>
                                                ${index < 3 ? '<div class="step-arrow">→</div>' : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="trainingResources" class="career-path mb-4">
                        <h3>Recommended Training & Resources</h3>
                        <div class="training-recommendations">
                            ${getTrainingRecommendations(result).map(training => `
                                <div class="training-item mb-3">
                                    <h4>${training.name}</h4>
                                    <p>${training.description}</p>
                                    <p><strong>Duration:</strong> ${training.duration}</p>
                                    <p><strong>Provider:</strong> ${training.provider}</p>
                                    <a href="${training.link}" target="_blank" class="btn btn-outline-primary btn-sm">Learn More</a>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="career-path mb-4">
                        <h3>Next Steps</h3>
                        <ol class="next-steps">
                            ${getNextSteps(result).map(step => `
                                <li class="mb-2">${step}</li>
                            `).join('')}
                        </ol>
                    </div>
                `;

                // Show results section and scroll
                resultsDiv.style.display = 'block';
                resultsDiv.scrollIntoView({ behavior: 'smooth' });
                
                DEBUG.info('Results displayed successfully');
                
            } catch (error) {
                DEBUG.error('Error processing form:', error);
                alert('There was an error processing your information. Please try again.');
            }
        });

        // Helper function to get MBTI type
        function getMBTIType(formData) {
            const ei = formData.get('mbti-ei') || '';
            const sn = formData.get('mbti-sn') || '';
            const tf = formData.get('mbti-tf') || '';
            const jp = formData.get('mbti-jp') || '';
            
            return `${ei}${sn}${tf}${jp}`;
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

        function getTrainingRecommendations(result) {
            const recommendations = [];
            
            // Base recommendations on career interests
            result.careerInterests.forEach(interest => {
                switch(interest) {
                    case 'trades':
                        recommendations.push({
                            name: 'Red Seal Certification',
                            description: 'Industry-recognized certification for skilled trades',
                            duration: '3-4 years',
                            provider: 'ITA BC',
                            link: 'https://www.itabc.ca/'
                        });
                        break;
                    case 'project-management':
                        recommendations.push({
                            name: 'Project Management Professional (PMP)',
                            description: 'Globally recognized project management certification',
                            duration: '6-12 months',
                            provider: 'PMI',
                            link: 'https://www.pmi.org/'
                        });
                        break;
                    case 'tech-specialist':
                        recommendations.push({
                            name: 'Construction Technology Certificate',
                            description: 'Advanced training in construction technology and software',
                            duration: '1 year',
                            provider: 'BCIT',
                            link: 'https://www.bcit.ca/'
                        });
                        break;
                    case 'estimator':
                        recommendations.push({
                            name: 'Construction Estimating Certificate',
                            description: 'Specialized training in construction cost estimation',
                            duration: '6-8 months',
                            provider: 'BCIT',
                            link: 'https://www.bcit.ca/'
                        });
                        break;
                    case 'heavy-machinery':
                        recommendations.push({
                            name: 'Heavy Equipment Operator Certification',
                            description: 'Certification for operating construction machinery',
                            duration: '3-6 months',
                            provider: 'Operating Engineers Training Institute',
                            link: 'https://www.iuoe115.ca/'
                        });
                        break;
                }
            });

            return recommendations;
        }

        function getNextSteps(result) {
            const steps = [];
            
            // Add basic steps
            steps.push('Update your resume to highlight relevant skills and experience');
            
            // Add certification steps based on experience
            if (result.constructionExperience === '0') {
                steps.push('Complete basic safety certifications (WHMIS, First Aid)');
                steps.push('Consider entry-level training programs or apprenticeships');
            }
            
            // Add steps based on career interests
            result.careerInterests.forEach(interest => {
                switch(interest) {
                    case 'trades':
                        steps.push('Research apprenticeship opportunities in your preferred trade');
                        steps.push('Contact local unions or trade associations');
                        break;
                    case 'project-management':
                        steps.push('Gain field experience in construction operations');
                        steps.push('Begin PMP certification preparation');
                        break;
                    case 'tech-specialist':
                        steps.push('Take online courses in construction technology');
                        steps.push('Get familiar with BIM and project management software');
                        break;
                    case 'estimator':
                        steps.push('Develop strong mathematical and analytical skills');
                        steps.push('Learn industry-standard estimating software');
                        break;
                    case 'heavy-machinery':
                        steps.push('Obtain necessary equipment operator licenses');
                        steps.push('Start with smaller equipment to gain experience');
                        break;
                }
            });
            
            // Add networking steps
            steps.push('Join professional associations in your chosen field');
            steps.push('Connect with industry professionals on LinkedIn');
            
            return steps;
        }

        // Add this new helper function for progression steps
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

    } catch (error) {
        console.error('Initialization failed:', error);
    }
}); 