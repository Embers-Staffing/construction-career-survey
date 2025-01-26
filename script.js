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
        console.log('Form submitted');

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Generating Recommendations...
        `;
        submitButton.disabled = true;

        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress mb-3';
        progressBar.innerHTML = `
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                 role="progressbar" 
                 style="width: 0%" 
                 aria-valuenow="0" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
            </div>
        `;
        submitButton.parentNode.insertBefore(progressBar, submitButton);

        try {
            const formData = new FormData(form);
            console.log('Form data collected');
            
            // Log form values
            console.log('MBTI:', getMBTIType(formData));
            console.log('Holland:', getHollandCode(formData));
            console.log('Career Interests:', formData.getAll('career-interests'));
            console.log('Tech Interests:', formData.getAll('tech-interests'));
            
            // Validate required fields
            if (!validateForm(formData)) {
                throw new Error('Please fill in all required fields');
            }
            
            // Create result object
            const result = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                age: calculateAge(formData.get('birth-year'), formData.get('birth-month')),
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

            console.log('Result object created:', result);

            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 10;
                const progressBarInner = progressBar.querySelector('.progress-bar');
                progressBarInner.style.width = `${progress}%`;
                progressBarInner.setAttribute('aria-valuenow', progress);

                if (progress >= 100) {
                    clearInterval(progressInterval);
                    
                    // Generate and display results
                    const html = generateResultsHTML(result);
                    resultsContent.innerHTML = html;
                    
                    // Show results section
                    resultsDiv.style.display = 'block';
                    
                    // Remove progress bar and restore button
                    progressBar.remove();
                    submitButton.innerHTML = 'Get Career Recommendations';
                    submitButton.disabled = false;

                    // Scroll to results
                    resultsDiv.scrollIntoView({ behavior: 'smooth' });
                    
                    console.log('Results displayed');
                }
            }, 200);

        } catch (error) {
            console.error('Error:', error);
            
            // Show error message
            alert(error.message || 'There was an error processing your results. Please try again.');
            
            // Restore button state
            progressBar.remove();
            submitButton.innerHTML = 'Get Career Recommendations';
            submitButton.disabled = false;
        }
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
        'project-management': 'Project Manager',
        'safety': 'Safety Professional',
        'property-development': 'Property Developer',
        'facilities': 'Facilities Manager',
        'sustainability': 'Sustainability Specialist',
        'quality-control': 'Quality Control Manager'
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
        },
        'safety': {
            description: 'Ensure workplace safety and regulatory compliance.',
            salary: 'Entry: $50,000 - $70,000 | Mid-Level: $70,000 - $100,000 | Director: $100,000+',
            advancement: 'Safety Coordinator → Safety Officer → Safety Manager → Safety Director'
        },
        'property-development': {
            description: 'Manage real estate development projects from concept to completion.',
            salary: 'Entry: $60,000 - $80,000 | Mid-Level: $80,000 - $120,000 | Director: $120,000+',
            advancement: 'Development Coordinator → Property Developer → Senior Developer → Development Director'
        },
        'facilities': {
            description: 'Oversee building operations and maintenance.',
            salary: 'Entry: $45,000 - $65,000 | Mid-Level: $65,000 - $95,000 | Director: $95,000+',
            advancement: 'Maintenance Tech → Facilities Coordinator → Facilities Manager → Operations Director'
        },
        'sustainability': {
            description: 'Implement sustainable construction practices and green building initiatives.',
            salary: 'Entry: $55,000 - $75,000 | Mid-Level: $75,000 - $105,000 | Director: $105,000+',
            advancement: 'Sustainability Coordinator → Specialist → Manager → Sustainability Director'
        },
        'quality-control': {
            description: 'Ensure construction quality standards and compliance.',
            salary: 'Entry: $50,000 - $70,000 | Mid-Level: $70,000 - $100,000 | Director: $100,000+',
            advancement: 'QC Inspector → QC Specialist → QC Manager → Quality Director'
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
        'ai': 'Construction AI/Automation Specialist',
        'robotics': 'Construction Robotics Engineer',
        'iot': 'IoT Systems Specialist',
        'data-analytics': 'Construction Data Analyst',
        'cyber-security': 'Construction Cybersecurity Specialist'
    };
    return specializations[tech] || tech;
}

function getTechDescription(tech) {
    const descriptions = {
        'drones': 'Aerial mapping, surveying, and site inspection using drone technology.',
        'vr-ar': 'Creating virtual walkthroughs and augmented reality solutions for construction projects.',
        'bim': 'Managing Building Information Modeling for project planning and coordination.',
        'ai': 'Implementing artificial intelligence and automation solutions in construction processes.',
        'robotics': 'Developing and implementing robotics solutions for construction tasks.',
        'iot': 'Implementing Internet of Things sensors and systems for smart construction.',
        'data-analytics': 'Analyzing construction data for insights and optimization.',
        'cyber-security': 'Protecting construction technology systems and data.'
    };
    return descriptions[tech] || 'Emerging technology in construction';
}

// Training recommendation function
function getTrainingRecommendations(result) {
    const trainingResources = {
        safety: {
            basic: [
                {
                    name: 'OSHA 30-Hour Construction',
                    description: 'Comprehensive safety training for construction industry',
                    provider: 'OSHA',
                    link: '#', // We'll add actual link
                    duration: '30 hours',
                    type: 'Certification'
                },
                {
                    name: 'First Aid and CPR',
                    description: 'Essential emergency response training',
                    provider: 'Red Cross',
                    link: '#',
                    duration: '8 hours',
                    type: 'Certification'
                }
            ],
            advanced: [
                {
                    name: 'Construction Health and Safety Technician (CHST)',
                    description: 'Advanced safety certification for construction professionals',
                    provider: 'BCSP',
                    link: '#',
                    duration: 'Self-paced',
                    type: 'Professional Certification'
                }
            ]
        },
        technical: {
            bim: [
                {
                    name: 'Autodesk BIM 360',
                    description: 'Construction management software training',
                    provider: 'Autodesk',
                    link: '#',
                    duration: '40 hours',
                    type: 'Software Certification'
                }
            ],
            drones: [
                {
                    name: 'FAA Part 107 Commercial Drone License',
                    description: 'Required certification for commercial drone operation',
                    provider: 'FAA',
                    link: '#',
                    duration: 'Self-paced',
                    type: 'License'
                }
            ]
        },
        management: {
            project: [
                {
                    name: 'Project Management Professional (PMP)',
                    description: 'Global standard in project management',
                    provider: 'PMI',
                    link: '#',
                    duration: '35 hours training required',
                    type: 'Professional Certification'
                }
            ],
            construction: [
                {
                    name: 'Construction Management Certificate',
                    description: 'Comprehensive construction management training',
                    provider: 'Local Technical Institute',
                    link: '#',
                    duration: '6 months',
                    type: 'Certificate Program'
                }
            ]
        }
    };

    // We'll continue building this out with your links and additional resources
    return selectRelevantTraining(result, trainingResources);
}

function selectRelevantTraining(result, resources) {
    let recommendations = [];

    // Base recommendations on experience level
    if (result.constructionExperience === '0') {
        recommendations.push(...resources.safety.basic);
    }

    // Add recommendations based on career interests
    result.careerInterests.forEach(interest => {
        switch(interest) {
            case 'project-management':
                recommendations.push(...resources.management.project);
                break;
            case 'tech-specialist':
                if (result.techInterests.includes('bim')) {
                    recommendations.push(...resources.technical.bim);
                }
                if (result.techInterests.includes('drones')) {
                    recommendations.push(...resources.technical.drones);
                }
                break;
            // We'll add more cases as we get more resources
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
        },
        'ESFJ': {
            title: 'Supportive Team Leader',
            strengths: 'Team coordination, communication, organization',
            careers: 'Project Coordinator, Safety Manager, Client Relations Manager'
        },
        'ISFJ': {
            title: 'Detail-Oriented Specialist',
            strengths: 'Precision, reliability, methodical approach',
            careers: 'Quality Control Inspector, Safety Specialist, Documentation Manager'
        },
        'ENFJ': {
            title: 'Inspiring Leader',
            strengths: 'People development, team building, communication',
            careers: 'Training Director, Project Manager, HR Development Manager'
        },
        'INFJ': {
            title: 'Strategic Planner',
            strengths: 'Long-term vision, people insight, complex problem-solving',
            careers: 'Sustainability Manager, Planning Director, Development Coordinator'
        },
        'ENFP': {
            title: 'Creative Innovator',
            strengths: 'Innovation, relationship building, adaptability',
            careers: 'Business Development, Innovation Manager, Client Relations Director'
        },
        'INFP': {
            title: 'Values-Driven Developer',
            strengths: 'Creative solutions, ethical approach, people development',
            careers: 'Training Developer, Sustainability Specialist, Planning Manager'
        },
        'ENTP': {
            title: 'Innovative Strategist',
            strengths: 'Strategic thinking, problem-solving, innovation',
            careers: 'Technology Integration Manager, Innovation Director, Business Strategist'
        },
        'INTP': {
            title: 'Technical Expert',
            strengths: 'Systems analysis, problem-solving, technical innovation',
            careers: 'BIM Manager, Systems Architect, Technical Director'
        },
        'ESTP': {
            title: 'Dynamic Implementer',
            strengths: 'Practical problem-solving, risk management, action-oriented',
            careers: 'Site Supervisor, Operations Manager, Project Manager'
        },
        'ISTP': {
            title: 'Skilled Technician',
            strengths: 'Technical expertise, troubleshooting, practical efficiency',
            careers: 'Equipment Specialist, Technical Lead, Operations Specialist'
        },
        'ESFP': {
            title: 'Practical Team Player',
            strengths: 'People skills, practical work, adaptability',
            careers: 'Team Supervisor, Safety Trainer, Field Operations Manager'
        },
        'ISFP': {
            title: 'Skilled Craftsperson',
            strengths: 'Attention to detail, hands-on skills, aesthetic awareness',
            careers: 'Skilled Tradesperson, Quality Specialist, Finishing Expert'
        }
    };

    const typeInfo = descriptions[type] || {
        title: 'Unique Profile',
        strengths: 'Versatile skill set with multiple applications',
        careers: 'Multiple career paths available based on interests and experience'
    };

    return `${typeInfo.title} - ${typeInfo.strengths} - Best suited for: ${typeInfo.careers}`;
}

// Helper function to generate results HTML
function generateResultsHTML(result) {
    return `
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

        <div class="career-path mb-4">
            <h3>Career Progression Path</h3>
            <div class="career-progression mb-4">
                <div class="career-flowchart">
                    ${generateCareerFlowchart(result)}
                </div>
            </div>
        </div>
    `;
}

function generateCareerFlowchart(result) {
    // Get primary career path based on interests and personality
    const careerPath = determineCareerPath(result);
    
    return `
        <div class="career-progression mb-4">
            <h3>Career Progression Path</h3>
            <div class="career-flowchart">
                ${careerPath.map((step, index) => `
                    <div class="career-step">
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <div class="salary">${step.salary}</div>
                            <div class="requirements">
                                <strong>Requirements:</strong>
                                <ul>
                                    ${step.requirements.map(req => `<li>${req}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="timeframe">Typical timeframe: ${step.timeframe}</div>
                        </div>
                        ${index < careerPath.length - 1 ? '<div class="step-arrow">→</div>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function determineCareerPath(result) {
    const careerPaths = {
        'project-management': [
            {
                title: 'Project Coordinator',
                salary: '$45,000 - $65,000',
                requirements: [
                    'Bachelor\'s degree or equivalent experience',
                    'Basic project management knowledge',
                    'Strong organizational skills'
                ],
                timeframe: '1-2 years'
            },
            {
                title: 'Assistant Project Manager',
                salary: '$65,000 - $85,000',
                requirements: [
                    '2-3 years experience',
                    'Project management software proficiency',
                    'Team coordination experience'
                ],
                timeframe: '2-3 years'
            },
            {
                title: 'Project Manager',
                salary: '$85,000 - $120,000',
                requirements: [
                    'PMP Certification',
                    '5+ years experience',
                    'Budget management experience'
                ],
                timeframe: '3-5 years'
            },
            {
                title: 'Senior Project Manager',
                salary: '$120,000 - $150,000',
                requirements: [
                    '8+ years experience',
                    'Multiple project oversight',
                    'Strategic planning skills'
                ],
                timeframe: '5+ years'
            }
        ],
        'tech-specialist': [
            {
                title: 'Technology Assistant',
                salary: '$50,000 - $70,000',
                requirements: [
                    'Technical degree or certification',
                    'Basic construction knowledge',
                    'Software proficiency'
                ],
                timeframe: '1-2 years'
            },
            {
                title: 'Construction Technologist',
                salary: '$70,000 - $90,000',
                requirements: [
                    'Advanced technical certifications',
                    '2-3 years experience',
                    'Project implementation experience'
                ],
                timeframe: '2-3 years'
            },
            {
                title: 'Senior Technology Specialist',
                salary: '$90,000 - $120,000',
                requirements: [
                    'Advanced certifications',
                    '5+ years experience',
                    'Team leadership experience'
                ],
                timeframe: '3-5 years'
            },
            {
                title: 'Technology Director',
                salary: '$120,000 - $180,000',
                requirements: [
                    '8+ years experience',
                    'Strategic technology planning',
                    'Innovation leadership'
                ],
                timeframe: '5+ years'
            }
        ],
        'trades': [
            {
                title: 'Apprentice',
                salary: '$35,000 - $45,000',
                requirements: [
                    'High school diploma or equivalent',
                    'Basic math and communication skills',
                    'Physical capability'
                ],
                timeframe: '1-2 years'
            },
            {
                title: 'Journeyman',
                salary: '$45,000 - $65,000',
                requirements: [
                    'Completed apprenticeship',
                    'Trade certification',
                    'Safety training'
                ],
                timeframe: '2-4 years'
            },
            {
                title: 'Master Tradesperson',
                salary: '$65,000 - $95,000',
                requirements: [
                    'Advanced certifications',
                    '5+ years experience',
                    'Leadership skills'
                ],
                timeframe: '4-6 years'
            },
            {
                title: 'Trade Business Owner',
                salary: '$95,000+',
                requirements: [
                    'Business management skills',
                    'Contractor license',
                    'Team management experience'
                ],
                timeframe: '6+ years'
            }
        ],
        'estimator': [
            {
                title: 'Junior Estimator',
                salary: '$45,000 - $60,000',
                requirements: [
                    'Construction-related degree',
                    'Basic estimating software skills',
                    'Attention to detail'
                ],
                timeframe: '0-2 years'
            },
            {
                title: 'Estimator',
                salary: '$60,000 - $85,000',
                requirements: [
                    'Advanced software proficiency',
                    '2-4 years experience',
                    'Industry knowledge'
                ],
                timeframe: '2-4 years'
            },
            {
                title: 'Senior Estimator',
                salary: '$85,000 - $110,000',
                requirements: [
                    'Professional certification',
                    '5+ years experience',
                    'Team leadership'
                ],
                timeframe: '4-6 years'
            },
            {
                title: 'Chief Estimator',
                salary: '$110,000+',
                requirements: [
                    'Advanced certifications',
                    '8+ years experience',
                    'Department management'
                ],
                timeframe: '6+ years'
            }
        ],
        'safety': [
            {
                title: 'Safety Coordinator',
                salary: '$45,000 - $60,000',
                requirements: [
                    'OSHA certification',
                    'Basic safety training',
                    'Communication skills'
                ],
                timeframe: '0-2 years'
            },
            {
                title: 'Safety Officer',
                salary: '$60,000 - $85,000',
                requirements: [
                    'Advanced safety certifications',
                    '2-4 years experience',
                    'Training capabilities'
                ],
                timeframe: '2-4 years'
            },
            {
                title: 'Safety Manager',
                salary: '$85,000 - $120,000',
                requirements: [
                    'CSP certification',
                    '5+ years experience',
                    'Program management'
                ],
                timeframe: '4-6 years'
            },
            {
                title: 'Safety Director',
                salary: '$120,000+',
                requirements: [
                    'Advanced certifications',
                    '8+ years experience',
                    'Strategic planning'
                ],
                timeframe: '6+ years'
            }
        ],
        'property-development': [
            {
                title: 'Development Coordinator',
                salary: '$50,000 - $70,000',
                requirements: [
                    'Real estate degree',
                    'Basic market knowledge',
                    'Project coordination'
                ],
                timeframe: '0-2 years'
            },
            {
                title: 'Property Developer',
                salary: '$70,000 - $100,000',
                requirements: [
                    'Financial analysis skills',
                    '3-5 years experience',
                    'Project management'
                ],
                timeframe: '2-4 years'
            },
            {
                title: 'Senior Developer',
                salary: '$100,000 - $150,000',
                requirements: [
                    'Advanced financial modeling',
                    '5+ years experience',
                    'Portfolio management'
                ],
                timeframe: '4-6 years'
            },
            {
                title: 'Development Director',
                salary: '$150,000+',
                requirements: [
                    'MBA preferred',
                    '8+ years experience',
                    'Strategic development'
                ],
                timeframe: '6+ years'
            }
        ]
    };

    // Get primary interest and personality type
    const primaryInterest = result.careerInterests[0];
    const mbtiType = result.mbtiType.split(' ')[0]; // Get just the MBTI code

    // Match career path based on interests and personality
    let selectedPath = careerPaths[primaryInterest];
    
    // If no direct match, use personality type to suggest alternative
    if (!selectedPath) {
        if (mbtiType.includes('ST')) {
            selectedPath = careerPaths['estimator'];
        } else if (mbtiType.includes('SF')) {
            selectedPath = careerPaths['safety'];
        } else if (mbtiType.includes('NT')) {
            selectedPath = careerPaths['tech-specialist'];
        } else if (mbtiType.includes('NF')) {
            selectedPath = careerPaths['property-development'];
        } else {
            selectedPath = careerPaths['project-management']; // Default path
        }
    }

    return selectedPath;
}

// Add other helper functions as needed...

// Add this function to handle Holland Code data
function getHollandCode(formData) {
    const selectedCodes = formData.getAll('holland') || [];
    if (selectedCodes.length === 0) return 'Not specified';
    
    // Convert codes to uppercase and join them
    const hollandCode = selectedCodes.map(code => code.toUpperCase()).join('');
    
    // Get description based on primary code (first selected)
    const descriptions = {
        'REALISTIC': 'Hands-on problem solver',
        'INVESTIGATIVE': 'Analytical thinker',
        'ARTISTIC': 'Creative innovator',
        'SOCIAL': 'People-oriented collaborator',
        'ENTERPRISING': 'Leadership-focused achiever',
        'CONVENTIONAL': 'Detail-oriented organizer'
    };
    
    const primaryCode = selectedCodes[0].toUpperCase();
    const description = descriptions[primaryCode] || '';
    
    return `${hollandCode} - ${description}`;
}

// Add form validation function
function validateForm(formData) {
    const requiredFields = [
        'firstName',
        'lastName',
        'birth-year',
        'birth-month',
        'constructionExperience',
        'mbti-ei',
        'mbti-sn',
        'mbti-tf',
        'mbti-jp'
    ];

    for (const field of requiredFields) {
        if (!formData.get(field)) {
            return false;
        }
    }

    return true;
} 