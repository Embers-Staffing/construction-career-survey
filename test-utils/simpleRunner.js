import { JSDOM } from 'jsdom';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new JSDOM instance
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
    <style>
        .invalid {
            border-color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="form-controls">
            <label for="fillModeToggle">Auto-Fill Mode</label>
            <input type="checkbox" id="fillModeToggle">
        </div>

        <form id="careerForm" novalidate>
            <div id="personal" class="section">
                <h2>Personal Information</h2>
                <input type="text" name="name" placeholder="Full Name" required>
                <select name="age" required>
                    <option value="">Select Age</option>
                    ${Array.from({length: 50}, (_, i) => i + 16).map(age => 
                        `<option value="${age}">${age}</option>`
                    ).join('')}
                </select>
            </div>

            <div id="personality" class="section">
                <h2>Personality Assessment</h2>
                <div class="mbti-section">
                    <label>MBTI Type:</label>
                    <input type="text" name="mbti" required>
                </div>
                <div class="holland-section">
                    <label>Holland Codes:</label>
                    <input type="text" name="holland" required>
                </div>
            </div>

            <div id="skills" class="section">
                <h2>Skills & Experience</h2>
                <textarea name="skills" required></textarea>
            </div>

            <div id="preferences" class="section">
                <h2>Work Preferences</h2>
                <select name="workStyle" required>
                    <option value="">Select Work Style</option>
                    <option value="hands-on">Hands-on</option>
                    <option value="management">Management</option>
                    <option value="technical">Technical</option>
                </select>
            </div>

            <div id="goals" class="section">
                <h2>Career Goals</h2>
                <textarea name="goals" required></textarea>
            </div>

            <button type="submit">Get Recommendations</button>
        </form>

        <div id="results" style="display: none;">
            <h2>Your Career Recommendations</h2>
            <div id="recommendations"></div>
        </div>

        <div id="notification" class="notification" style="display: none;"></div>
    </div>
</body>
</html>
`, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
});

// Set up global environment
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.CustomEvent = dom.window.CustomEvent;

// Mock external functions
const mockRecommendations = [
    {
        title: 'Construction Manager',
        description: 'Manages construction projects',
        requirements: ['Bachelor\'s degree', '5 years experience'],
        salary: '$80,000 - $120,000'
    },
    {
        title: 'Site Supervisor',
        description: 'Supervises construction sites',
        requirements: ['Associate\'s degree', '3 years experience'],
        salary: '$60,000 - $90,000'
    }
];

window.getRecommendations = async () => mockRecommendations;
window.autoFillSurvey = async () => {
    const form = document.getElementById('careerForm');
    form.querySelector('[name="name"]').value = 'John Doe';
    form.querySelector('[name="age"]').value = '25';
    form.querySelector('[name="mbti"]').value = 'ISTJ';
    form.querySelector('[name="holland"]').value = 'RIA';
    form.querySelector('[name="skills"]').value = 'Project management, Leadership';
    form.querySelector('[name="workStyle"]').value = 'management';
    form.querySelector('[name="goals"]').value = 'Become a construction manager';
};
window.showNotification = (message, type) => {
    console.log(`Notification: ${message} (${type})`);
};
window.DEBUG = {
    info: console.log,
    error: console.error
};

// Initialize form controls
window.CONFIG = {
    MIN_AGE: 16,
    MAX_AGE: 65,
    AUTO_FILL_MODE: false
};

// Load and execute test script
const scriptContent = fs.readFileSync(path.join(__dirname, 'script-test.js'), 'utf8');
const scriptElement = document.createElement('script');
scriptElement.textContent = scriptContent;
document.body.appendChild(scriptElement);

// Trigger DOMContentLoaded
const event = new dom.window.Event('DOMContentLoaded');
document.dispatchEvent(event);

// Run tests
async function runTests() {
    try {
        console.log('Running functional tests...\n');

        // Test 1: Complete form submission workflow with auto-fill
        console.log('Test 1: Complete form submission workflow with auto-fill');
        const fillModeToggle = document.getElementById('fillModeToggle');
        const form = document.getElementById('careerForm');
        const results = document.getElementById('results');

        fillModeToggle.click();
        await new Promise(resolve => setTimeout(resolve, 100));

        assert.strictEqual(form.querySelector('[name="name"]').value, 'John Doe', 'Name should be auto-filled');
        assert.strictEqual(form.querySelector('[name="age"]').value, '25', 'Age should be auto-filled');
        assert.strictEqual(form.querySelector('[name="mbti"]').value, 'ISTJ', 'MBTI should be auto-filled');
        console.log('✓ Auto-fill functionality works correctly\n');

        // Test 2: Form validation in manual mode
        console.log('Test 2: Form validation in manual mode');
        fillModeToggle.click(); // Disable auto-fill
        await new Promise(resolve => setTimeout(resolve, 100));

        const nameInput = form.querySelector('[name="name"]');
        const ageSelect = form.querySelector('[name="age"]');

        // Clear form fields
        nameInput.value = '';
        ageSelect.value = '';
        
        // Trigger blur events to validate
        nameInput.dispatchEvent(new dom.window.Event('blur'));
        ageSelect.dispatchEvent(new dom.window.Event('blur'));
        await new Promise(resolve => setTimeout(resolve, 100));

        assert(nameInput.classList.contains('invalid'), 'Empty name field should be marked as invalid');
        assert(ageSelect.classList.contains('invalid'), 'Empty age field should be marked as invalid');

        // Fill required fields
        nameInput.value = 'Jane Doe';
        ageSelect.value = '30';
        
        // Trigger input events
        nameInput.dispatchEvent(new dom.window.Event('input'));
        ageSelect.dispatchEvent(new dom.window.Event('input'));
        await new Promise(resolve => setTimeout(resolve, 100));

        assert(!nameInput.classList.contains('invalid'), 'Filled name field should not be marked as invalid');
        assert(!ageSelect.classList.contains('invalid'), 'Filled age field should not be marked as invalid');
        console.log('✓ Form validation works correctly\n');

        // Test 3: Form state preservation during mode switches
        console.log('Test 3: Form state preservation during mode switches');
        const inputs = {
            name: 'Jane Doe',
            age: '30',
            mbti: 'ENFP',
            holland: 'ASE',
            skills: 'Leadership, Communication',
            workStyle: 'management',
            goals: 'Lead construction projects'
        };

        Object.entries(inputs).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            input.value = value;
            input.dispatchEvent(new dom.window.Event('input'));
        });

        fillModeToggle.click(); // Enable auto-fill
        await new Promise(resolve => setTimeout(resolve, 100));

        Object.entries(inputs).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            assert.strictEqual(input.value, value, `${name} value should be preserved`);
        });
        console.log('✓ Form state preservation works correctly\n');

        // Test 4: Form submission with valid data
        console.log('Test 4: Form submission with valid data');
        
        // Fill all required fields
        Object.entries(inputs).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            input.value = value;
            input.dispatchEvent(new dom.window.Event('input'));
        });

        // Submit form
        form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
        await new Promise(resolve => setTimeout(resolve, 100));

        assert.strictEqual(results.style.display, 'block', 'Results should be displayed after valid submission');
        assert(results.querySelector('.recommendation'), 'Recommendations should be rendered');
        console.log('✓ Form submission works correctly\n');

        console.log('All tests passed! ✨');

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTests();
