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
            // Replace with your Google Apps Script Web App URL
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            displayResults(result);
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your form. Please try again.');
        }
    });

    // Add to the DOMContentLoaded event listener:
    const sections = document.querySelectorAll('.section');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Update progress indicator based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            if (index < progressSteps.length) {
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
        ]
        // Add more career paths...
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
        'Corporate Safety Director': '• CRSP Certification\n• 15+ years experience\n• Advanced Safety Certifications'
        // Add more requirements...
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