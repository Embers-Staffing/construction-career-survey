document.addEventListener('DOMContentLoaded', function() {
    // Limit Holland Code selections to 3
    const hollandCheckboxes = document.querySelectorAll('.holland-code');
    hollandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.holland-code:checked');
            if (checked.length > 3) {
                this.checked = false;
                alert('Please select up to 3 categories only.');
            }
        });
    });

    // Limit career choices to 3
    const careerChoices = document.querySelectorAll('.career-choice');
    careerChoices.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.career-choice:checked');
            if (checked.length > 3) {
                this.checked = false;
                alert('Please select up to 3 career choices only.');
            }
        });
    });

    // Limit career goals to 3
    const careerGoals = document.querySelectorAll('.career-goal');
    careerGoals.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.career-goal:checked');
            if (checked.length > 3) {
                this.checked = false;
                alert('Please select up to 3 career goals only.');
            }
        });
    });

    // Form validation
    const form = document.getElementById('careerForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const data = {
            activities: formData.get('activities'),
            environment: formData.get('environment'),
            hollandCodes: formData.getAll('holland'),
            skills: formData.getAll('skills'),
            experience: formData.get('experience'),
            trainingWillingness: formData.get('training-willingness'),
            careerInterests: formData.getAll('career-interests'),
            stressHandling: formData.get('stress-handling'),
            learningStyle: formData.get('learning-style'),
            industryAppeal: formData.getAll('industry-appeal'),
            certificationAwareness: formData.get('certification-awareness'),
            environmentComfort: formData.get('environment-comfort'),
            workingConditions: formData.getAll('working-conditions'),
            workHours: formData.get('work-hours'),
            travelWillingness: formData.get('travel-willingness'),
            workLifeBalance: formData.get('work-life-balance'),
            careerGoals: formData.getAll('career-goals'),
            careerTimeline: formData.get('career-timeline'),
            projectInterest: formData.get('project-interest'),
            salaryTarget: formData.get('salary-target'),
            advancementPreference: formData.get('advancement-preference'),
            desiredSkills: formData.getAll('desired-skills'),
            internationalInterest: formData.get('international-interest'),
            mentorshipType: formData.get('mentorship-type'),
            // Add more fields as needed
        };

        try {
            // For testing/demo purposes, we'll just simulate a successful response
            // Replace this with your actual API endpoint when ready
            const result = {
                careers: ['Project Manager', 'Construction Manager', 'Site Supervisor'],
                training: [
                    'Project Management Professional (PMP) Certification',
                    'Construction Management Certificate',
                    'Leadership Training'
                ]
            };
            
            displayResults(result);
            
            // Scroll to results
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error:', error);
            // Show error message to user
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3';
            errorAlert.role = 'alert';
            errorAlert.textContent = 'There was an error processing your form. Please try again.';
            form.appendChild(errorAlert);
            
            // Remove error message after 5 seconds
            setTimeout(() => errorAlert.remove(), 5000);
        }
    });

    // Add to the DOMContentLoaded event listener:
    const sections = document.querySelectorAll('.section');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Update progress indicator based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const sections = [
            document.querySelector('.section:nth-child(1)'), // Interests & Personality
            document.querySelector('.section:nth-child(2)'), // Career Preferences
            document.querySelector('.section:nth-child(3)'), // Work Environment
            document.querySelector('.section:nth-child(4)')  // Development & Goals
        ];
        
        sections.forEach((section, index) => {
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    progressSteps.forEach(step => step.classList.remove('active'));
                    progressSteps[index].classList.add('active');
                }
            }
        });
    });
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    // Create primary recommendations section
    resultsContent.innerHTML = `
        <div class="career-path">
            <h3>Recommended Career Paths</h3>
            <ul>
                ${results.careers.map(career => `<li>${career}</li>`).join('')}
            </ul>
        </div>
        
        <div class="career-path">
            <h3>Required Training</h3>
            <ul>
                ${results.training.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;

    // Create career progression flowchart
    const flowchartContainer = document.querySelector('.flowchart-container');
    createCareerFlowchart(flowchartContainer, results.careers[0]);

    // Add training resources
    const resourcesContainer = document.querySelector('.resources-container');
    addTrainingResources(resourcesContainer, results.careers[0]);
    
    resultsDiv.style.display = 'block';
}

function createCareerFlowchart(container, primaryCareer) {
    const careerPaths = {
        'Heavy Equipment Operator': [
            'Entry Level Operator',
            'Certified Operator',
            'Senior Operator',
            'Equipment Supervisor',
            'Operations Manager'
        ],
        'Project Manager': [
            'Project Coordinator',
            'Assistant Project Manager',
            'Project Manager',
            'Senior Project Manager',
            'Program Director'
        ],
        'Safety Professional': [
            'Safety Coordinator',
            'Safety Officer',
            'Safety Supervisor',
            'Safety Manager',
            'HSE Director'
        ],
        'Crane Operator': [
            'Apprentice Operator',
            'Licensed Operator',
            'Lead Operator',
            'Crane Supervisor',
            'Operations Manager'
        ],
        'Business Owner': [
            'Trade Professional',
            'Lead Tradesperson',
            'Small Business Owner',
            'Construction Company Owner',
            'Industry Leader'
        ],
        'Safety Director': [
            'Safety Coordinator',
            'Safety Manager',
            'Regional Safety Director',
            'Corporate Safety Director',
            'VP of Safety'
        ],
        'Property Developer': [
            'Property Developer Assistant',
            'Property Developer',
            'Senior Property Developer',
            'Real Estate Investment Manager',
            'Director of Property Development'
        ],
        'Facilities Management': [
            'Maintenance Worker',
            'Facilities Coordinator',
            'Facilities Manager',
            'Director of Operations',
            'Chief Operating Officer'
        ],
        'Engineering Management': [
            'Engineer',
            'Project Engineer',
            'Project Manager',
            'Senior Project Manager',
            'Engineering Director'
        ],
        'Safety Management': [
            'Tradesperson',
            'Safety Officer',
            'Safety Supervisor',
            'Safety Manager',
            'Safety Director'
        ],
        'Entrepreneurial': [
            'Skilled Tradesperson',
            'Independent Contractor',
            'Small Business Owner',
            'Multiple Crews Owner',
            'Construction Company CEO'
        ],
        'Technology Specialist': [
            'Construction Technologist',
            'Drone Operations Specialist',
            'VR Construction Designer',
            'Construction AI Specialist',
            'Digital Innovation Director'
        ]
    };

    const path = careerPaths[primaryCareer] || [];
    
    if (path.length > 0) {
        const flowchart = document.createElement('div');
        flowchart.className = 'career-flowchart';
        
        path.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'career-step';
            stepElement.innerHTML = `
                <div class="step-content">
                    <h4>${step}</h4>
                    <p>${getStepRequirements(step)}</p>
                </div>
                ${index < path.length - 1 ? '<div class="step-arrow">→</div>' : ''}
            `;
            flowchart.appendChild(stepElement);
        });
        
        container.appendChild(flowchart);
    }
}

function getStepRequirements(step) {
    const requirements = {
        'Entry Level Operator': '• Valid driver\'s license\n• Basic safety training',
        'Certified Operator': '• Equipment certification\n• 2 years experience',
        'Safety Coordinator': '• OHS Certificate\n• First Aid Certification',
        'Licensed Operator': '• Crane Operator Certification\n• 3-5 years experience',
        'Lead Operator': '• Advanced Certification\n• Supervisory Experience',
        'Small Business Owner': '• Business License\n• Management Experience\n• Financial Planning',
        'Construction Company Owner': '• Business Degree or equivalent\n• 10+ years experience\n• Project Management Professional (PMP)',
        'Corporate Safety Director': '• CRSP Certification\n• 15+ years experience\n• Advanced Safety Certifications',
        'Property Developer Assistant': '• Bachelor\'s in Real Estate or Business\n• Basic understanding of property markets',
        'Property Developer': '• 3-5 years experience\n• Project management skills\n• Financial analysis capability',
        'Senior Property Developer': '• 7+ years experience\n• Portfolio of successful projects\n• Advanced financial modeling',
        'Real Estate Investment Manager': '• 10+ years experience\n• MBA preferred\n• Investment strategy expertise',
        'Director of Property Development': '• 15+ years experience\n• Executive leadership skills\n• Strategic planning expertise',
        'Maintenance Worker': '• Technical certification\n• Basic maintenance skills\n• Safety training',
        'Facilities Coordinator': '• 2-3 years experience\n• Project coordination skills\n• CMMS knowledge',
        'Facilities Manager': '• 5+ years experience\n• FMP certification\n• Team management',
        'Director of Operations': '• 10+ years experience\n• CFM certification\n• Strategic planning',
        'Construction Technologist': '• IT degree or certification\n• Construction software expertise',
        'Drone Operations Specialist': '• FAA certification\n• Construction mapping experience',
        'VR Construction Designer': '• 3D modeling expertise\n• VR/AR development skills',
        'Construction AI Specialist': '• Computer Science degree\n• AI/ML expertise\n• Construction knowledge',
        'Digital Innovation Director': '• 10+ years experience\n• Technology strategy\n• Innovation management'
    };
    
    return requirements[step] || 'Requirements vary by location and employer';
}

function addTrainingResources(container, career) {
    const resources = {
        'Heavy Equipment Operator': [
            { name: 'Equipment Operation Certification', provider: 'Technical Safety BC' },
            { name: 'Safety Training', provider: 'WorkSafeBC' }
        ],
        'Project Manager': [
            { name: 'Project Management Professional (PMP)', provider: 'Project Management Institute' },
            { name: 'Construction Management Certificate', provider: 'Local Technical Institute' },
            { name: 'Leadership Development Program', provider: 'Construction Association' }
        ],
        'Business Owner': [
            { name: 'Business Management Certificate', provider: 'Business Development Bank' },
            { name: 'Construction Business Management', provider: 'Industry Association' },
            { name: 'Financial Management for Contractors', provider: 'Construction Association' }
        ],
        'International Opportunities': [
            { name: 'International Construction Management', provider: 'Global Construction Institute' },
            { name: 'Cross-Cultural Communication', provider: 'International Business School' },
            { name: 'Global Project Management', provider: 'PMI Global' }
        ],
        'Property Developer': [
            { name: 'Real Estate Development Certificate', provider: 'Urban Land Institute' },
            { name: 'Financial Modeling for Real Estate', provider: 'ARGUS Software' },
            { name: 'Property Development Strategy', provider: 'Real Estate Institute' }
        ],
        'Facilities Management': [
            { name: 'Facility Management Professional (FMP)', provider: 'IFMA' },
            { name: 'Certified Facility Manager (CFM)', provider: 'IFMA' },
            { name: 'Building Systems Maintenance', provider: 'BOMI International' }
        ],
        'Technology Specialist': [
            { name: 'Drone Pilot Certification', provider: 'FAA' },
            { name: 'VR Development for Construction', provider: 'Autodesk' },
            { name: 'AI in Construction Management', provider: 'Construction Tech Institute' },
            { name: 'BIM Management Certificate', provider: 'Autodesk' }
        ]
    };

    const careerResources = resources[career] || [];
    
    if (careerResources.length > 0) {
        const resourcesList = document.createElement('ul');
        resourcesList.className = 'resources-list';
        
        careerResources.forEach(resource => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${resource.name}</strong> - ${resource.provider}`;
            resourcesList.appendChild(li);
        });
        
        container.appendChild(resourcesList);
    }
} 