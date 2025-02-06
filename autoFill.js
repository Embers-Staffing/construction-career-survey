'use strict';

// Debug utility
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

/**
 * Randomly select one item from an array
 * @param {Array} array - Array to select from
 * @returns {*} Random item from the array
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a random MBTI type by randomly selecting each preference with weighted probabilities
 * @returns {string} Random MBTI type (e.g., 'ENFJ', 'ISTP', etc.)
 */
function getRandomMBTI() {
    const preferences = {
        EI: [['E', 0.5], ['I', 0.5]],  // Equal distribution
        SN: [['S', 0.7], ['N', 0.3]],  // S is more common
        TF: [['T', 0.4], ['F', 0.6]],  // F is slightly more common
        JP: [['J', 0.5], ['P', 0.5]]   // Equal distribution
    };

    return Object.values(preferences)
        .map(pairs => {
            const rand = Math.random();
            let cumProb = 0;
            for (const [value, prob] of pairs) {
                cumProb += prob;
                if (rand < cumProb) return value;
            }
            return pairs[0][0]; // Fallback to first option
        })
        .join('');
}

/**
 * Get random Holland codes by selecting 3 unique codes with weighted selection
 * @returns {Array<string>} Array of 3 unique Holland codes
 */
function getRandomHollandCodes() {
    const codesWithWeights = [
        ['realistic', 0.2],
        ['investigative', 0.15],
        ['artistic', 0.15],
        ['social', 0.2],
        ['enterprising', 0.15],
        ['conventional', 0.15]
    ];
    
    const selectedCodes = [];
    const remainingCodes = [...codesWithWeights];
    
    while (selectedCodes.length < 3 && remainingCodes.length > 0) {
        // Calculate total weight of remaining codes
        const totalWeight = remainingCodes.reduce((sum, [_, weight]) => sum + weight, 0);
        
        // Generate random value between 0 and total weight
        let rand = Math.random() * totalWeight;
        let cumWeight = 0;
        
        // Find the selected code based on weights
        for (let i = 0; i < remainingCodes.length; i++) {
            cumWeight += remainingCodes[i][1];
            if (rand <= cumWeight) {
                selectedCodes.push(remainingCodes[i][0]);
                remainingCodes.splice(i, 1);
                break;
            }
        }
    }
    
    return selectedCodes;
}

/**
 * Generate random personal profile data
 * @returns {Object} Object containing personal profile data
 */
function getRandomPersonalProfile() {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    // Generate birth year between 1963 and 2007 (16-60 years old)
    const currentYear = new Date().getFullYear();
    const birthYear = Math.floor(Math.random() * (2007 - 1963 + 1)) + 1963;
    
    const experienceLevels = ['none', 'less-than-1', '1-to-3', '3-to-5', '5-to-10', 'more-than-10'];
    const experienceWeights = [0.2, 0.2, 0.3, 0.15, 0.1, 0.05]; // More weight to early career

    return {
        firstName: getRandomItem(firstNames),
        lastName: getRandomItem(lastNames),
        birthYear: birthYear.toString(),
        birthMonth: (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0'),
        constructionExperience: weightedRandomSelect(experienceLevels, experienceWeights)
    };
}

/**
 * Generate random skills and experience data
 * @returns {Object} Object containing skills and experience data
 */
function getRandomSkillsAndExperience() {
    // Core skills with weighted probabilities
    const coreSkills = {
        'hand-tools': 0.8,      // Very common
        'blueprint': 0.6,       // Common
        'math': 0.7,           // Very common
        'safety': 0.9,         // Almost always selected
        'equipment': 0.5,      // Moderately common
        'computer': 0.4        // Less common
    };

    // Select core skills based on probabilities
    const selectedCoreSkills = Object.entries(coreSkills)
        .filter(([skill, prob]) => Math.random() < prob)
        .map(([skill]) => skill);

    // Ensure at least 2 core skills are selected
    while (selectedCoreSkills.length < 2) {
        const skill = getRandomItem(Object.keys(coreSkills));
        if (!selectedCoreSkills.includes(skill)) {
            selectedCoreSkills.push(skill);
        }
    }

    // Certification awareness with weighted distribution
    const certificationWeights = {
        'very-aware': 0.2,
        'somewhat-aware': 0.5,
        'not-aware': 0.3
    };

    // Experience level with weighted distribution
    const experienceWeights = {
        'none': 0.15,
        'less-than-1': 0.25,
        '1-to-3': 0.3,
        '3-to-5': 0.15,
        '5-to-10': 0.1,
        'more-than-10': 0.05
    };

    return {
        technicalSkills: selectedCoreSkills,
        certificationAwareness: weightedRandomSelect(
            Object.keys(certificationWeights),
            Object.values(certificationWeights)
        ),
        constructionExperience: weightedRandomSelect(
            Object.keys(experienceWeights),
            Object.values(experienceWeights)
        )
    };
}

/**
 * Generate random work preferences data
 * @returns {Object} Object containing work preferences
 */
function getRandomWorkPreferences() {
    // Career interests with weighted probabilities
    const careerInterests = {
        'trades': 0.4,
        'heavy-machinery': 0.3,
        'tech-specialist': 0.2,
        'estimator': 0.2,
        'project-management': 0.3
    };

    // Select career interests based on probabilities
    const selectedCareerInterests = Object.entries(careerInterests)
        .filter(([_, prob]) => Math.random() < prob)
        .map(([interest]) => interest);

    // Ensure at least one career interest is selected
    if (selectedCareerInterests.length === 0) {
        selectedCareerInterests.push(getRandomItem(Object.keys(careerInterests)));
    }

    // Tech interests with weighted probabilities
    const techInterests = {
        'drones': 0.3,
        'vr-ar': 0.2,
        'bim': 0.25,
        'ai': 0.15
    };

    // Select tech interests based on probabilities
    const selectedTechInterests = Object.entries(techInterests)
        .filter(([_, prob]) => Math.random() < prob)
        .map(([interest]) => interest);

    // Work environment preferences with realistic weights
    const environmentWeights = {
        'outdoor': 0.4,    // Most construction workers prefer outdoor
        'indoor': 0.2,     // Fewer prefer purely indoor
        'mixed': 0.4       // Many are okay with mixed
    };

    // Travel willingness with realistic weights
    const travelWeights = {
        'no-travel': 0.2,
        'occasional': 0.4,
        'frequent': 0.3,
        'extensive': 0.1
    };

    return {
        careerInterests: selectedCareerInterests,
        techInterests: selectedTechInterests,
        environmentComfort: weightedRandomSelect(
            Object.keys(environmentWeights),
            Object.values(environmentWeights)
        ),
        travelWillingness: weightedRandomSelect(
            Object.keys(travelWeights),
            Object.values(travelWeights)
        )
    };
}

/**
 * Generate random technical skills and interests
 * @returns {Object} Object containing skills and interests
 */
function getRandomSkillsAndInterests() {
    const technicalSkills = ['hand-tools', 'blueprint', 'math', 'safety', 'equipment', 'computer'];
    const careerInterests = ['trades', 'heavy-machinery', 'tech-specialist', 'estimator', 'project-management'];
    const techInterests = ['drones', 'vr-ar', 'bim', 'ai'];
    
    // Select 2-4 technical skills
    const numSkills = Math.floor(Math.random() * 3) + 2;
    const selectedSkills = selectRandomSubset(technicalSkills, numSkills);
    
    // Select 2-3 career interests
    const numCareerInterests = Math.floor(Math.random() * 2) + 2;
    const selectedCareerInterests = selectRandomSubset(careerInterests, numCareerInterests);
    
    // Select 1-2 tech interests
    const numTechInterests = Math.floor(Math.random() * 2) + 1;
    const selectedTechInterests = selectRandomSubset(techInterests, numTechInterests);
    
    return {
        technicalSkills: selectedSkills,
        careerInterests: selectedCareerInterests,
        techInterests: selectedTechInterests,
        certificationAwareness: getRandomItem(['very-aware', 'somewhat-aware', 'not-aware']),
        environmentComfort: getRandomItem(['outdoor', 'indoor', 'mixed']),
        travelWillingness: getRandomItem(['no-travel', 'occasional', 'frequent', 'extensive'])
    };
}

/**
 * Generate random career goals and development preferences
 * @returns {Object} Object containing goals and preferences
 */
function getRandomGoalsAndDevelopment() {
    const careerGoals = ['leadership', 'specialist', 'business', 'innovation'];
    
    // Select 1-3 career goals
    const numGoals = Math.floor(Math.random() * 3) + 1;
    const selectedGoals = selectRandomSubset(careerGoals, numGoals);
    
    return {
        careerGoals: selectedGoals,
        advancementPreference: getRandomItem(['education', 'experience', 'both']),
        mentorshipType: getRandomItem(['one-on-one', 'group', 'mixed', 'self-paced']),
        salaryTarget: getRandomItem(['entry-level', 'mid-level', 'senior-level', 'management'])
    };
}

/**
 * Helper function to select random subset of array
 * @param {Array} array - Array to select from
 * @param {number} count - Number of items to select
 * @returns {Array} Selected items
 */
function selectRandomSubset(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Helper function for weighted random selection
 * @param {Array} items - Array of items to select from
 * @param {Array} weights - Array of weights corresponding to items
 * @returns {*} Selected item
 */
function weightedRandomSelect(items, weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
        random -= weights[i];
        if (random <= 0) return items[i];
    }
    
    return items[0];
}

/**
 * Set form field values
 * @param {Object} data - Object containing form field values
 */
function setFormFields(data) {
    // Set text inputs
    Object.entries(data).forEach(([name, value]) => {
        if (typeof value === 'string') {
            const input = document.querySelector(`input[name="${name}"], select[name="${name}"]`);
            if (input) {
                if (input.tagName === 'SELECT') {
                    input.value = value;
                } else {
                    input.value = value;
                }
            }
        } else if (Array.isArray(value)) {
            // Handle checkboxes (arrays of values)
            value.forEach(v => {
                const checkbox = document.querySelector(`input[name="${name}"][value="${v}"], input[name="${name}[]"][value="${v}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    });
}

/**
 * Auto-fill the survey form with random values
 */
export async function autoFillSurvey() {
    DEBUG.info('Starting auto-fill process');

    try {
        // Get random values for all sections
        const personalProfile = getRandomPersonalProfile();
        const skillsAndExperience = getRandomSkillsAndExperience();
        const workPreferences = getRandomWorkPreferences();
        const goalsAndDevelopment = getRandomGoalsAndDevelopment();
        const mbtiType = getRandomMBTI();
        const hollandCodes = getRandomHollandCodes();
        
        DEBUG.info('Generated random values:', {
            personalProfile,
            skillsAndExperience,
            workPreferences,
            goalsAndDevelopment,
            mbtiType,
            hollandCodes
        });

        // Set all form fields
        setFormFields(personalProfile);
        setFormFields(skillsAndExperience);
        setFormFields(workPreferences);
        setFormFields(goalsAndDevelopment);
        
        // Set MBTI preferences
        const mbtiPairs = {
            'ei-preference': mbtiType[0],
            'sn-preference': mbtiType[1],
            'tf-preference': mbtiType[2],
            'jp-preference': mbtiType[3]
        };
        setFormFields(mbtiPairs);
        
        // Set Holland codes
        hollandCodes.forEach(code => {
            const checkbox = document.querySelector(`input[value="${code}"]`);
            if (checkbox) checkbox.checked = true;
        });

        DEBUG.info('Form values set, submitting');

        // Get the form element
        const form = document.getElementById('careerForm');
        if (!form) {
            throw new Error('Career form not found');
        }

        // Create and dispatch submit event
        const submitEvent = new CustomEvent('submit', {
            bubbles: true,
            cancelable: true
        });
        
        form.dispatchEvent(submitEvent);
    } catch (error) {
        DEBUG.error('Error in autoFillSurvey:', error);
        throw error;
    }
}

// Make autoFillSurvey available globally
window.autoFillSurvey = autoFillSurvey;
