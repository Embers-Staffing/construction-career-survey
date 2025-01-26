document.addEventListener('DOMContentLoaded', function() {
    // Get form and results elements
    const form = document.getElementById('careerForm');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log

        // Get form data
        const formData = new FormData(form);

        // Create basic result
        const result = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            constructionExperience: formData.get('constructionExperience')
        };

        console.log('Result:', result); // Debug log

        // Create simple results HTML
        const html = `
            <div class="career-path mb-4">
                <h3>Personal Profile</h3>
                <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
                <p><strong>Experience:</strong> ${result.constructionExperience} years</p>
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