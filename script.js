document.addEventListener('DOMContentLoaded', function() {
    // Get form and results elements
    const form = document.getElementById('careerForm');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');

    // Populate year dropdown
    const yearSelect = document.querySelector('select[name="birth-year"]');
    const currentYear = new Date().getFullYear();
    const minAge = 16;
    const maxAge = 70;
    
    for (let i = currentYear - maxAge; i <= currentYear - minAge; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Add age display element after the age selector
    const ageSelector = document.querySelector('.age-selector');
    const ageDisplay = document.createElement('div');
    ageDisplay.className = 'age-display text-muted mt-2';
    ageSelector.after(ageDisplay);

    // Function to update age display
    function updateAgeDisplay() {
        const yearSelect = document.querySelector('select[name="birth-year"]');
        const monthSelect = document.querySelector('select[name="birth-month"]');
        
        if (yearSelect.value && monthSelect.value) {
            const age = calculateAge(yearSelect.value, monthSelect.value);
            ageDisplay.textContent = `Age: ${age} years old`;
            ageDisplay.style.display = 'block';
        } else {
            ageDisplay.style.display = 'none';
        }
    }

    // Add event listeners for year and month selects
    document.querySelector('select[name="birth-year"]').addEventListener('change', updateAgeDisplay);
    document.querySelector('select[name="birth-month"]').addEventListener('change', updateAgeDisplay);

    // Update the age calculation function
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

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log

        // Get form data
        const formData = new FormData(form);
        const birthYear = formData.get('birth-year');
        const birthMonth = formData.get('birth-month');
        
        // Calculate age from year and month
        const age = calculateAge(birthYear, birthMonth);
        formData.set('age', age);

        // Gather all form data
        const result = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            constructionExperience: formData.get('constructionExperience'),
            mbtiType: getMBTIType(formData),
            hollandCode: getHollandCode(formData),
            careerInterests: formData.getAll('career-interests'),
            techInterests: formData.getAll('tech-interests'),
            environment: formData.get('environment-comfort'),
            travelWillingness: formData.get('travel-willingness'),
            salaryTarget: formData.get('salary-target'),
            advancementPreference: formData.get('advancement-preference'),
            mentorshipType: formData.get('mentorship-type')
        };

        console.log('Result:', result); // Debug log

        // Create detailed results HTML
        const html = `
            <div class="career-path mb-4">
                <h3>Personal Profile</h3>
                <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                <p><strong>Experience:</strong> ${result.constructionExperience === '0' ? 'New to Construction' : `${result.constructionExperience} years`}</p>
                <p><strong>Personality Type:</strong> ${result.mbtiType}</p>
                <p><strong>Work Style:</strong> ${result.hollandCode}</p>
            </div>

            <div class="career-path mb-4">
                <h3>Recommended Career Paths</h3>
                <div class="recommendations">
                    ${generateCareerRecommendations(result)}
                </div>
            </div>

            <div class="career-path mb-4">
                <h3>Development Plan</h3>
                <div class="development-plan">
                    ${generateDevelopmentPlan(result)}
                </div>
            </div>

            <div class="career-path mb-4">
                <h3>Next Steps</h3>
                <div class="next-steps">
                    ${generateNextSteps(result)}
                </div>
            </div>
        `;

        // Update results
        resultsContent.innerHTML = html;
        
        // Show results section
        resultsDiv.style.display = 'block';
        
        // Scroll to results
        resultsDiv.scrollIntoView();

        console.log('Results displayed'); // Debug log
    });
});

function generateCareerRecommendations(result) {
    let recommendations = '';
    
    if (result.careerInterests.length > 0) {
        recommendations += '<h4 class="mb-3">Based on your interests:</h4>';
        result.careerInterests.forEach(interest => {
            const careerInfo = getCareerDescription(interest);
            recommendations += `
                <div class="career-card mb-4 p-3 border rounded">
                    <h5>${getCareerTitle(interest)}</h5>
                    <p class="mb-2">${careerInfo.description}</p>
                    <div class="salary-range mb-2">
                        <strong>Salary Ranges:</strong><br>
                        ${careerInfo.salary}
                    </div>
                    <div class="career-path">
                        <strong>Career Path:</strong><br>
                        ${careerInfo.advancement}
                    </div>
                </div>`;
        });
    }

    // Technology specializations
    if (result.techInterests.length > 0) {
        recommendations += '<h4 class="mb-3 mt-4">Technology Specializations:</h4><ul class="list-unstyled">';
        result.techInterests.forEach(tech => {
            recommendations += `
                <li class="mb-3">
                    <div class="d-flex align-items-start">
                        <i class="bi bi-laptop me-2 mt-1"></i>
                        <div>
                            <strong>${getTechSpecialization(tech)}</strong>
                            <p class="text-muted mb-0">${getTechDescription(tech)}</p>
                        </div>
                    </div>
                </li>`;
        });
        recommendations += '</ul>';
    }

    return recommendations;
}

function generateDevelopmentPlan(result) {
    return `
        <div class="development-steps">
            <h4 class="mb-3">Recommended Training:</h4>
            <ul class="list-unstyled">
                ${getTrainingRecommendations(result).map(training => `
                    <li class="mb-3">
                        <div class="d-flex align-items-start">
                            <i class="bi bi-book me-2 mt-1"></i>
                            <div>
                                <strong>${training.name}</strong>
                                <p class="text-muted mb-0">${training.description}</p>
                            </div>
                        </div>
                    </li>
                `).join('')}
            </ul>

            <h4 class="mb-3 mt-4">Mentorship Path:</h4>
            <p>${getMentorshipRecommendation(result.mentorshipType)}</p>

            <h4 class="mb-3 mt-4">Career Advancement:</h4>
            <p>${getAdvancementPath(result.advancementPreference)}</p>
        </div>
    `;
}

function generateNextSteps(result) {
    return `
        <ol class="next-steps-list">
            <li class="mb-2">Connect with Embers Staffing Solutions for job opportunities</li>
            <li class="mb-2">Research and enroll in recommended training programs</li>
            <li class="mb-2">Join professional associations in your chosen field</li>
            <li class="mb-2">Build your professional network through industry events</li>
            <li class="mb-2">Create a development timeline with specific milestones</li>
        </ol>
        
        <div class="mt-4">
            <p class="mb-2"><strong>Need help getting started?</strong></p>
            <p>Contact Embers Staffing Solutions to discuss your career path and find opportunities that match your goals.</p>
        </div>
    `;
}

// Helper functions for career and training information
function getCareerTitle(interest) {
    const titles = {
        'trades': 'Skilled Tradesperson',
        'heavy-machinery': 'Heavy Equipment Operator',
        'tech-specialist': 'Construction Technology Specialist',
        'estimator': 'Cost Estimator/Quantity Surveyor',
        'project-management': 'Project Manager'
    };
    return titles[interest] || interest;
}

function getCareerDescription(interest) {
    const descriptions = {
        'trades': {
            description: 'Specialized work in construction trades with opportunities for advancement and business ownership.',
            salary: 'Entry: $45,000 - $65,000 | Experienced: $65,000 - $95,000 | Master: $95,000+',
            advancement: 'Apprentice → Journeyman → Master → Business Owner'
        },
        'heavy-machinery': {
            description: 'Operation and management of construction equipment with focus on safety and efficiency.',
            salary: 'Entry: $50,000 - $70,000 | Experienced: $70,000 - $100,000 | Supervisor: $100,000+',
            advancement: 'Trainee → Operator → Lead Operator → Operations Manager'
        },
        'tech-specialist': {
            description: 'Implementation of cutting-edge technology in construction processes.',
            salary: 'Entry: $55,000 - $75,000 | Experienced: $75,000 - $110,000 | Lead: $110,000+',
            advancement: 'Tech Assistant → Specialist → Lead Specialist → Innovation Director'
        },
        'estimator': {
            description: 'Analysis and estimation of construction costs and project planning.',
            salary: 'Entry: $50,000 - $70,000 | Mid-Level: $70,000 - $100,000 | Senior: $100,000+',
            advancement: 'Junior Estimator → Estimator → Senior Estimator → Chief Estimator'
        },
        'project-management': {
            description: 'Overall project coordination and team leadership.',
            salary: 'Entry: $60,000 - $80,000 | Mid-Level: $80,000 - $120,000 | Senior: $120,000+',
            advancement: 'Project Coordinator → Project Manager → Senior PM → Program Director'
        }
    };
    return descriptions[interest] || '';
}

// Tech specialization functions
function getTechSpecialization(tech) {
    const specializations = {
        'drones': 'Drone Operations Specialist',
        'vr-ar': 'Virtual/Augmented Reality Designer',
        'bim': 'BIM Specialist',
        'ai': 'Construction AI/Automation Specialist'
    };
    return specializations[tech] || tech;
}

function getTechDescription(tech) {
    const descriptions = {
        'drones': 'Aerial mapping, surveying, and site inspection using drone technology.',
        'vr-ar': 'Creating virtual walkthroughs and augmented reality solutions for construction projects.',
        'bim': 'Managing Building Information Modeling for project planning and coordination.',
        'ai': 'Implementing artificial intelligence and automation solutions in construction processes.'
    };
    return descriptions[tech] || '';
}

// Training recommendation function
function getTrainingRecommendations(result) {
    let recommendations = [];
    
    // Basic recommendations based on experience
    if (result.constructionExperience === '0') {
        recommendations.push({
            name: 'Construction Safety Fundamentals',
            description: 'Essential safety training for construction site work.'
        });
    }

    // Career-specific training
    result.careerInterests.forEach(interest => {
        switch(interest) {
            case 'trades':
                recommendations.push({
                    name: 'Trade Apprenticeship Program',
                    description: 'Structured training combining classroom learning with hands-on experience.'
                });
                break;
            case 'heavy-machinery':
                recommendations.push({
                    name: 'Heavy Equipment Certification',
                    description: 'Official certification for operating construction machinery.'
                });
                break;
            case 'tech-specialist':
                recommendations.push({
                    name: 'Construction Technology Certificate',
                    description: 'Comprehensive training in modern construction technologies.'
                });
                break;
            case 'estimator':
                recommendations.push({
                    name: 'Cost Estimation Certification',
                    description: 'Professional certification in construction cost estimation.'
                });
                break;
            case 'project-management':
                recommendations.push({
                    name: 'Project Management Professional (PMP)',
                    description: 'Internationally recognized project management certification.'
                });
                break;
        }
    });

    // Tech-specific training
    result.techInterests.forEach(tech => {
        switch(tech) {
            case 'drones':
                recommendations.push({
                    name: 'FAA Part 107 Commercial Drone License',
                    description: 'Required certification for commercial drone operation.'
                });
                break;
            case 'vr-ar':
                recommendations.push({
                    name: 'VR/AR Development for Construction',
                    description: 'Specialized training in virtual and augmented reality applications.'
                });
                break;
            case 'bim':
                recommendations.push({
                    name: 'BIM Management Certificate',
                    description: 'Advanced training in Building Information Modeling systems.'
                });
                break;
        }
    });

    return recommendations;
}

// Mentorship recommendation function
function getMentorshipRecommendation(mentorshipType) {
    const recommendations = {
        'formal': 'We recommend enrolling in Embers\' structured mentorship program, which pairs you with an experienced industry professional for regular guidance and feedback.',
        'informal': 'Consider our on-the-job mentoring opportunities where you can learn directly from experienced professionals in your chosen field.',
        'peer': 'Join our peer mentoring network to connect with others at similar career stages and share experiences and knowledge.',
        'industry': 'We can connect you with industry experts through our professional network for specialized guidance in your field.'
    };
    return recommendations[mentorshipType] || 'We\'ll help you find the right mentorship opportunity to match your goals.';
}

// Career advancement path function
function getAdvancementPath(preference) {
    const paths = {
        'education': 'Focus on formal education and certifications with our educational partners. We\'ll help you identify and pursue relevant certifications and degrees in your field.',
        'experience': 'Emphasis on hands-on experience through progressive job roles. We\'ll help you find opportunities to build practical skills and advance through experience.',
        'both': 'Balanced approach combining formal education with practical experience. We\'ll create a customized plan that includes both certification programs and hands-on learning opportunities.'
    };
    return paths[preference] || 'We\'ll work with you to create a personalized advancement plan that fits your goals.';
}

// MBTI type interpretation function
function getMBTIType(formData) {
    const ei = formData.get('mbti-ei') || '';
    const sn = formData.get('mbti-sn') || '';
    const tf = formData.get('mbti-tf') || '';
    const jp = formData.get('mbti-jp') || '';
    
    if (!ei || !sn || !tf || !jp) return 'Personality assessment incomplete';
    
    return `${ei}${sn}${tf}${jp} - ${getMBTIDescription(ei + sn + tf + jp)}`;
}

function getMBTIDescription(type) {
    const descriptions = {
        'ESTJ': {
            title: 'Practical, organized leader',
            strengths: 'Strong organization, leadership, and practical problem-solving skills',
            careers: 'Project Manager, Site Supervisor, Safety Director'
        },
        'ISTJ': {
            title: 'Detail-oriented, reliable professional',
            strengths: 'Attention to detail, systematic approach, reliability',
            careers: 'Estimator, Quality Control Manager, Building Inspector'
        },
        'ENTJ': {
            title: 'Strategic, decisive manager',
            strengths: 'Strategic planning, leadership, decision-making',
            careers: 'Construction Executive, Program Director, Business Development'
        },
        'INTJ': {
            title: 'Innovative, analytical planner',
            strengths: 'Strategic thinking, innovation, complex problem-solving',
            careers: 'Construction Technology Specialist, Design Manager, Engineering Lead'
        },
        'ESFJ': {
            title: 'Supportive, organized coordinator',
            strengths: 'Team coordination, client relations, organization',
            careers: 'Project Coordinator, Client Relations Manager, Safety Coordinator'
        },
        'ISFJ': {
            title: 'Detail-focused, supportive specialist',
            strengths: 'Attention to detail, reliability, support-oriented',
            careers: 'Quality Assurance, Documentation Specialist, Safety Inspector'
        },
        'ENTP': {
            title: 'Innovative problem-solver',
            strengths: 'Innovation, adaptability, strategic thinking',
            careers: 'Technology Integration Specialist, Innovation Lead, Startup Founder'
        },
        'INTP': {
            title: 'Analytical innovator',
            strengths: 'Complex problem-solving, systems thinking, innovation',
            careers: 'BIM Specialist, Systems Analyst, Technical Lead'
        },
        'ESTP': {
            title: 'Action-oriented implementer',
            strengths: 'Practical problem-solving, adaptability, hands-on work',
            careers: 'Site Supervisor, Equipment Operator, Field Operations'
        },
        'ISTP': {
            title: 'Practical problem-solver',
            strengths: 'Technical skills, troubleshooting, practical solutions',
            careers: 'Skilled Tradesperson, Technical Specialist, Equipment Technician'
        },
        'ESFP': {
            title: 'People-oriented doer',
            strengths: 'Team collaboration, practical work, people skills',
            careers: 'Team Lead, Safety Trainer, Client Relations'
        },
        'ISFP': {
            title: 'Skilled craftsperson',
            strengths: 'Attention to detail, practical skills, artistic sense',
            careers: 'Skilled Tradesperson, Finishing Specialist, Detail Work'
        },
        'ENFJ': {
            title: 'People-focused leader',
            strengths: 'Team leadership, communication, development of others',
            careers: 'Training Manager, Team Leader, HR Development'
        },
        'INFJ': {
            title: 'Insightful planner',
            strengths: 'Long-term planning, people insight, complex problem-solving',
            careers: 'Planning Specialist, Development Manager, Sustainability Lead'
        },
        'ENFP': {
            title: 'Enthusiastic innovator',
            strengths: 'Innovation, people skills, adaptability',
            careers: 'Business Development, Sales Manager, Innovation Specialist'
        },
        'INFP': {
            title: 'Values-driven creator',
            strengths: 'Creative problem-solving, values alignment, development',
            careers: 'Sustainability Specialist, Training Developer, Planning Coordinator'
        }
    };
    return descriptions[type] || { 
        title: 'Unique combination of traits',
        strengths: 'Varied skill set with multiple applications',
        careers: 'Multiple career paths available'
    };
}

// Add other helper functions as needed... 