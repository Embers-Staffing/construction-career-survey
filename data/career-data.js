'use strict';

import { getCareerDetails as getDetailedCareerInfo } from './careers/index.js';

// Debug utility (mirroring the main script's DEBUG)
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

/**
 * Career data object containing recommendations for each MBTI type
 * @typedef {Object} CareerData
 * @property {Object} recommendations - Object mapping MBTI types to career title arrays
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
    }
};

/**
 * Get career recommendations based on MBTI type
 * @param {string} mbtiType - The MBTI personality type
 * @returns {string[]} Array of recommended career titles
 */
export function getRecommendations(mbtiType) {
    DEBUG.info('Getting recommendations for MBTI:', mbtiType);
    const recommendations = careerData.recommendations[mbtiType] || [];
    DEBUG.info('Found recommendations:', recommendations);
    return recommendations;
}

/**
 * Get detailed information about a specific career
 * @param {string} careerPath - The career title to look up
 * @returns {Object|null} Career details object or null if not found
 */
export function getCareerDetails(careerPath) {
    DEBUG.info('Getting career details for:', careerPath);
    const details = getDetailedCareerInfo(careerPath);
    DEBUG.info('Found career details:', !!details);
    return details;
}
