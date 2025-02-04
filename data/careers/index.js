'use strict';

// Debug utility
const DEBUG = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args)
};

import { managementCareers } from './management.js';
import { fieldCareers } from './field.js';
import { technicalCareers } from './technical.js';
import { safetyCareers } from './safety.js';
import { hrCareers } from './hr.js';

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
 * @param {string} title - The title of the career to look up
 * @returns {Object|null} - Career details object or null if not found
 */
export function getCareerDetails(title) {
    DEBUG.info('Looking up career details for:', title);
    if (!title || typeof title !== 'string') {
        DEBUG.error('Invalid title provided to getCareerDetails:', title);
        return null;
    }

    // Try exact match first
    let details = allCareers[title];
    
    // If no exact match, try case-insensitive match
    if (!details) {
        const titleLower = title.toLowerCase();
        const key = Object.keys(allCareers).find(k => k.toLowerCase() === titleLower);
        if (key) {
            details = allCareers[key];
        }
    }

    DEBUG.info('Found career details:', details ? 'yes' : 'no');
    return details || null;
}

// Export all careers for reference
export const careerDetails = allCareers;
