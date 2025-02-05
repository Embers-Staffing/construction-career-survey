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
 * @returns {string[]} Array of recommended career titles
 */
export function getRecommendations(mbtiType, hollandCodes = []) {
    try {
        DEBUG.info('Getting recommendations for:', { mbtiType, hollandCodes });
        
        // Get MBTI-based recommendations
        const mbtiRecommendations = new Set(careerData.recommendations[mbtiType] || []);
        DEBUG.info('MBTI recommendations:', Array.from(mbtiRecommendations));
        
        // If no Holland codes provided, return MBTI recommendations
        if (!hollandCodes || hollandCodes.length === 0) {
            DEBUG.info('No Holland codes provided, returning MBTI recommendations:', Array.from(mbtiRecommendations));
            return Array.from(mbtiRecommendations);
        }
        
        // Get Holland code based recommendations
        const hollandRecommendations = new Set();
        hollandCodes.forEach(code => {
            const codeRecs = careerData.hollandCodeMapping[code.toLowerCase()] || [];
            codeRecs.forEach(rec => hollandRecommendations.add(rec));
        });
        DEBUG.info('Holland recommendations:', Array.from(hollandRecommendations));
        
        // Find intersection between MBTI and Holland recommendations
        const finalRecommendations = Array.from(mbtiRecommendations)
            .filter(rec => hollandRecommendations.has(rec));
        
        // If no matches found, return top 3 from each set
        if (finalRecommendations.length === 0) {
            const mbtiTop3 = Array.from(mbtiRecommendations).slice(0, 3);
            const hollandTop3 = Array.from(hollandRecommendations).slice(0, 3);
            const combinedRecs = [...new Set([...mbtiTop3, ...hollandTop3])];
            DEBUG.info('No direct matches, returning combined recommendations:', combinedRecs);
            return combinedRecs;
        }
        
        DEBUG.info('Found matching recommendations:', finalRecommendations);
        return finalRecommendations;
    } catch (error) {
        DEBUG.error('Error in getRecommendations:', error);
        return [];
    }
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
