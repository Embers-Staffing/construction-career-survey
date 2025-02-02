'use strict';

import { app, db } from './public-config.js';
import { collection, doc, getDoc, setDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Service class for handling career recommendations and survey responses
 */
export class CareerRecommendationService {
    constructor() {
        this.db = db;
    }

    /**
     * Get career recommendations based on Holland Code
     * @param {string} hollandCode - Three-letter Holland Code (e.g., 'RIA')
     * @returns {Promise<Object>} Career recommendations
     */
    async getHollandCodeRecommendations(hollandCode) {
        try {
            const docRef = doc(this.db, 'holland_codes', hollandCode);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.warn(`No recommendations found for Holland Code: ${hollandCode}`);
                return null;
            }
        } catch (error) {
            console.error('Error getting Holland Code recommendations:', error);
            throw error;
        }
    }

    /**
     * Get MBTI description from database
     * @param {string} mbtiType - Four-letter MBTI type (e.g., 'ISTJ')
     * @returns {Promise<string>} MBTI description
     */
    async getMBTIDescription(mbtiType) {
        try {
            const descDoc = await this.db.collection('mbti_descriptions').doc(mbtiType).get();
            if (descDoc.exists) {
                return descDoc.data().description;
            }
            console.warn(`No description found for MBTI type: ${mbtiType}`);
            return null;
        } catch (error) {
            console.error('Error getting MBTI description:', error);
            return null;
        }
    }

    /**
     * Get career recommendations based on MBTI type
     * @param {string} mbtiType - Four-letter MBTI type (e.g., 'ISTJ')
     * @returns {Promise<Object>} Career recommendations
     */
    async getMBTIRecommendations(mbtiType) {
        try {
            const mbtiDoc = await this.db.collection('mbti_types').doc(mbtiType).get();
            const descDoc = await this.db.collection('mbti_descriptions').doc(mbtiType).get();
            
            if (!mbtiDoc.exists) {
                console.warn(`No recommendations found for MBTI type: ${mbtiType}`);
                return null;
            }

            const data = mbtiDoc.data();
            const description = descDoc.exists ? descDoc.data().description : '';
            
            return {
                jobs: data.jobs,
                description: description
            };
        } catch (error) {
            console.error('Error getting MBTI recommendations:', error);
            return null;
        }
    }

    /**
     * Get combined recommendations based on Holland Code and MBTI type
     * @param {string} hollandCode - Three-letter Holland Code (e.g., 'RIA')
     * @param {string} mbtiType - Four-letter MBTI type (e.g., 'ISTJ')
     * @returns {Promise<Object>} Combined career recommendations
     */
    async getRecommendations(hollandCode, mbtiType) {
        try {
            const [hollandRecommendations, mbtiRecommendations] = await Promise.all([
                this.getHollandCodeRecommendations(hollandCode),
                this.getMBTIRecommendations(mbtiType)
            ]);

            return {
                hollandCode: hollandRecommendations,
                mbti: mbtiRecommendations
            };
        } catch (error) {
            console.error('Error getting combined recommendations:', error);
            throw error;
        }
    }

    /**
     * Store a survey response with recommendations
     * @param {Object} surveyData - Survey response data
     * @param {Object} recommendations - Generated recommendations
     * @returns {Promise<string>} ID of the stored survey response
     */
    async storeSurveyResponse(surveyData, recommendations) {
        try {
            const response = {
                ...surveyData,
                recommendations,
                timestamp: new Date().toISOString(),
                status: 'completed'
            };

            const docRef = await addDoc(collection(this.db, 'survey_responses'), response);
            console.log('Survey response stored with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error storing survey response:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const careerRecommendationService = new CareerRecommendationService();
