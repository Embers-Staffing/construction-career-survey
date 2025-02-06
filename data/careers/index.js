'use strict';

import { managementCareers } from './management.js';
import { fieldCareers } from './field.js';
import { technicalCareers } from './technical.js';
import { safetyCareers } from './safety.js';
import { hrCareers } from './hr.js';

// Debug utility
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

/**
 * Combined career details from all categories
 * @type {Object.<string, Object>}
 */
const allCareers = {
    ...managementCareers,
    ...fieldCareers,
    ...technicalCareers,
    ...safetyCareers,
    ...hrCareers
};

DEBUG.info('Loaded career details:', Object.keys(allCareers));

/**
 * Get detailed information about a specific career
 * @param {string} careerTitle - The career title to look up
 * @returns {Object|null} Career details object or null if not found
 */
export function getCareerDetails(careerTitle) {
    try {
        DEBUG.info('Looking up career details for:', careerTitle);
        
        // Try exact match first
        if (allCareers[careerTitle]) {
            DEBUG.info('Found exact match for:', careerTitle);
            return allCareers[careerTitle];
        }

        // Try case-insensitive match
        const normalizedTitle = careerTitle.toLowerCase();
        const match = Object.entries(allCareers).find(([key]) => 
            key.toLowerCase() === normalizedTitle
        );

        if (match) {
            DEBUG.info('Found case-insensitive match:', match[0]);
            return match[1];
        }

        // No match found
        DEBUG.warn('No career details found for:', careerTitle);
        DEBUG.info('Available careers:', Object.keys(allCareers));
        return null;
    } catch (error) {
        DEBUG.error('Error in getCareerDetails:', error);
        return null;
    }
}

// Export all careers for reference
export const careerDetails = allCareers;
