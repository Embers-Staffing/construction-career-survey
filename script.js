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

        // Add event listener for Holland Code checkboxes
        hollandCodeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedCount = document.querySelectorAll('.holland-code:checked').length;
                if (checkedCount > 3) {
                    this.checked = false;
                    alert('Please select no more than 3 personality types.');
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
                const hollandRecommendations = recommendations?.hollandCode?.recommendations || {};
                const mbtiRecommendations = recommendations?.mbtiType?.recommendations || {};

                // Generate and display results HTML
                resultsContent.innerHTML = `
                    <div class="career-path mb-4">
                        <h3>Personal Profile</h3>
                        <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                        <p><strong>Age:</strong> ${result.age}</p>
                        <p><strong>Construction Experience:</strong> ${result.constructionExperience}</p>
                        <p><strong>MBTI Type:</strong> ${result.mbtiType}</p>
                        <p><strong>Holland Code:</strong> ${result.hollandCode}</p>
                    </div>

                    <div class="recommendations mb-4">
                        <h3>Career Recommendations</h3>
                        ${hollandRecommendations.careers ? `
                            <div class="mb-3">
                                <h4>Based on Your Holland Code (${recommendations.hollandCode.code}):</h4>
                                <ul>
                                    ${hollandRecommendations.careers.map(career => `<li>${career}</li>`).join('')}
                                </ul>
                            </div>
                        ` : '<p>No specific Holland Code recommendations available yet.</p>'}

                        ${mbtiRecommendations.careers ? `
                            <div class="mb-3">
                                <h4>Based on Your MBTI Type (${recommendations.mbtiType.type}):</h4>
                                <ul>
                                    ${mbtiRecommendations.careers.map(career => `<li>${career}</li>`).join('')}
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

                    <div class="next-steps mb-4">
                        <h3>Recommended Next Steps</h3>
                        <ul>
                            ${getNextSteps(result).map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="training mb-4">
                        <h3>Training & Development</h3>
                        <ul>
                            ${getTrainingRecommendations(result).map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
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

    } catch (error) {
        console.error('Initialization failed:', error);
    }
}); 