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

/**
 * Combined career details from all categories
 * @type {Object.<string, Object>}
 */
const allCareers = {
    ...managementCareers,
    ...fieldCareers,
    ...technicalCareers,
    ...safetyCareers
};

/**
 * Get detailed information about a specific career
 * @param {string} title - The title of the career to look up
 * @returns {Object|null} - Career details object or null if not found
 */
export function getCareerDetails(title) {
    DEBUG.info('Looking up career details for:', title);
    const details = allCareers[title] || null;
    DEBUG.info('Found career details:', details);
    return details;
}
