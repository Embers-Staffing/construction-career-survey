document.getElementById('careerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        motivation: formData.getAll('motivation'),
        mbtiEnergy: formData.get('mbti-energy'),
        mbtiInfo: formData.get('mbti-info'),
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
        // Add more resources...
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