'use strict';

import { getCareerDetails as getDetailedCareerInfo } from './careers/index.js';

// Debug utility (mirroring the main script's DEBUG)
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

/**
 * Career data object containing recommendations for each MBTI type and Holland code
 */
export const careerData = {
    recommendations: {
        'ISTJ': ['Construction Superintendent', 'Construction Estimator', 'Building Inspector'],
        'ISFJ': ['Safety Manager', 'Quality Control Inspector', 'Construction Administrator'],
        'INFJ': ['Sustainability Consultant', 'BIM Specialist', 'Environmental Specialist'],
        'INTJ': ['Civil Engineer', 'Construction Technology Specialist', 'Project Controls Manager'],
        'ISTP': ['Heavy Equipment Operator', 'Electrician', 'Mechanical Technician'],
        'ISFP': ['Interior Designer', 'Landscape Designer', 'Architectural Drafter'],
        'INFP': ['Environmental Consultant', 'Green Building Specialist', 'Architectural Designer'],
        'INTP': ['Structural Engineer', 'BIM Specialist', 'Construction Software Developer'],
        'ESTP': ['Construction Foreman', 'Site Supervisor', 'Equipment Manager'],
        'ESFP': ['Real Estate Developer', 'Sales Representative', 'Client Relations Manager'],
        'ENFP': ['Client Relations Director', 'Construction Business Developer', 'Project Development Manager'],
        'ENTP': ['Innovation Manager', 'Construction Technology Director', 'Business Development Manager'],
        'ESTJ': ['Construction Project Manager', 'Operations Director', 'General Contractor'],
        'ESFJ': ['Construction Safety Officer', 'Human Resources Manager', 'Client Service Manager'],
        'ENFJ': ['Training Director', 'Team Development Manager', 'Community Relations Manager'],
        'ENTJ': ['Executive Construction Manager', 'Company Owner', 'Strategic Planning Director']
    },
    hollandCodeMapping: {
        'realistic': [
            'Construction Superintendent',
            'Heavy Equipment Operator',
            'Electrician',
            'Mechanical Technician',
            'Construction Foreman',
            'Site Supervisor'
        ],
        'investigative': [
            'Civil Engineer',
            'Structural Engineer',
            'BIM Specialist',
            'Construction Technology Specialist',
            'Environmental Specialist',
            'Project Controls Manager'
        ],
        'artistic': [
            'Interior Designer',
            'Landscape Designer',
            'Architectural Designer',
            'Architectural Drafter',
            'Green Building Specialist'
        ],
        'social': [
            'Training Director',
            'Team Development Manager',
            'Safety Manager',
            'Construction Safety Officer',
            'Human Resources Manager',
            'Community Relations Manager'
        ],
        'enterprising': [
            'Construction Project Manager',
            'Executive Construction Manager',
            'Company Owner',
            'Real Estate Developer',
            'Business Development Manager',
            'Client Relations Director'
        ],
        'conventional': [
            'Construction Estimator',
            'Building Inspector',
            'Quality Control Inspector',
            'Construction Administrator',
            'Project Controls Manager'
        ]
    }
};

/**
 * Get career recommendations based on MBTI type and Holland codes
 * @param {string} mbtiType - The MBTI personality type
 * @param {string[]} hollandCodes - Array of Holland codes
 * @returns {Array<{title: string, score: number}>} Array of recommended careers with scores
 */
export function getRecommendations(mbtiType, hollandCodes = []) {
    try {
        DEBUG.info('Getting recommendations for:', { mbtiType, hollandCodes });
        
        // Initialize scoring weights
        const MBTI_WEIGHT = 0.6;
        const HOLLAND_WEIGHT = 0.4;
        
        // Get all possible MBTI types that match the pattern with X
        const possibleTypes = getPossibleMBTITypes(mbtiType);
        DEBUG.info('Possible MBTI types:', possibleTypes);
        
        // Calculate MBTI-based recommendations with scores
        const recommendationsMap = new Map();
        
        // Score based on MBTI type matches
        possibleTypes.forEach(type => {
            const typeRecommendations = careerData.recommendations[type] || [];
            const matchScore = calculateMBTIMatchScore(mbtiType, type);
            
            typeRecommendations.forEach(career => {
                const currentScore = recommendationsMap.get(career)?.score || 0;
                recommendationsMap.set(career, {
                    title: career,
                    score: Math.max(currentScore, matchScore * MBTI_WEIGHT)
                });
            });
        });
        
        // Add Holland code based scoring
        if (hollandCodes && hollandCodes.length > 0) {
            hollandCodes.forEach((code, index) => {
                const codeRecs = careerData.hollandCodeMapping[code.toLowerCase()] || [];
                const hollandScore = (hollandCodes.length - index) / hollandCodes.length; // Higher priority to first codes
                
                codeRecs.forEach(career => {
                    const current = recommendationsMap.get(career) || { title: career, score: 0 };
                    const hollandBonus = hollandScore * HOLLAND_WEIGHT;
                    recommendationsMap.set(career, {
                        title: career,
                        score: current.score + hollandBonus
                    });
                });
            });
        }
        
        // Sort recommendations by score and convert to array
        const recommendations = Array.from(recommendationsMap.values())
            .sort((a, b) => b.score - a.score)
            .map(item => ({
                ...item,
                score: Math.round(item.score * 100) / 100 // Round to 2 decimal places
            }));
            
        DEBUG.info('Final recommendations with scores:', recommendations);
        return recommendations;
        
    } catch (error) {
        DEBUG.error('Error getting recommendations:', error);
        return [];
    }
}

/**
 * Calculate how well two MBTI types match
 * @param {string} inputType - Input MBTI type with possible X wildcards
 * @param {string} matchType - Full MBTI type to match against
 * @returns {number} Match score between 0 and 1
 */
function calculateMBTIMatchScore(inputType, matchType) {
    let matchCount = 0;
    
    for (let i = 0; i < 4; i++) {
        if (inputType[i] === 'X' || inputType[i] === matchType[i]) {
            matchCount++;
        }
    }
    
    return matchCount / 4;
}

/**
 * Get all possible MBTI types that match a pattern with X wildcards
 * @param {string} mbtiType - MBTI type with possible X wildcards
 * @returns {string[]} Array of matching MBTI types
 */
function getPossibleMBTITypes(mbtiType) {
    const positions = [];
    for (let i = 0; i < mbtiType.length; i++) {
        if (mbtiType[i] === 'X') positions.push(i);
    }
    
    if (positions.length === 0) return [mbtiType];
    
    const possibilities = ['EI', 'SN', 'TF', 'JP'];
    let combinations = [mbtiType];
    
    positions.forEach(pos => {
        const index = Math.floor(pos / 1);
        const chars = possibilities[index];
        const newCombos = [];
        
        combinations.forEach(combo => {
            chars.split('').forEach(char => {
                newCombos.push(combo.substring(0, pos) + char + combo.substring(pos + 1));
            });
        });
        
        combinations = newCombos;
    });
    
    return combinations;
}

/**
 * Get detailed information about a specific career
 * @param {string} careerPath - The career title to look up
 * @returns {Object|null} Career details object or null if not found
 */
export function getCareerDetails(careerPath) {
    try {
        DEBUG.info('Getting career details for:', careerPath);
        const details = getDetailedCareerInfo(careerPath);
        DEBUG.info('Found career details:', !!details);
        return details || null;
    } catch (error) {
        DEBUG.error('Error in getCareerDetails:', error);
        return null;
    }
}
