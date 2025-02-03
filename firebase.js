'use strict';

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5u_38A4uHPRh9V9tEGqLAm3GVEmnGrNs",
    authDomain: "construction-career-survey.firebaseapp.com",
    projectId: "construction-career-survey",
    storageBucket: "construction-career-survey.appspot.com",
    messagingSenderId: "1019913567537",
    appId: "1:1019913567537:web:8e5b2d1b9e1c9b1b9e1c9b"
};

/**
 * Service class for handling career recommendations and survey responses
 */
class CareerRecommendationService {
    constructor() {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }

    /**
     * Get MBTI type description
     * @param {string} type - MBTI type code (e.g., 'INTJ')
     * @returns {Promise<string>} Description of the MBTI type
     */
    async getMBTIDescription(type) {
        try {
            const docRef = doc(this.db, 'mbti_descriptions', type);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.warn(`No description found for MBTI type: ${type}`);
                return null;
            }
            
            return docSnap.data().description;
        } catch (error) {
            console.error('Error getting MBTI description:', error);
            throw error;
        }
    }

    /**
     * Get MBTI recommendations
     * @param {string} mbtiType - MBTI type code
     * @returns {Promise<Object>} MBTI recommendations
     */
    async getMBTIRecommendations(mbtiType) {
        try {
            const docRef = doc(this.db, 'mbti_types', mbtiType);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.warn(`No recommendations found for MBTI type: ${mbtiType}`);
                return null;
            }
            
            return docSnap.data();
        } catch (error) {
            console.error('Error getting MBTI recommendations:', error);
            throw error;
        }
    }

    /**
     * Get Holland Code recommendations
     * @param {string} hollandCode - Holland Code (e.g., 'RIA')
     * @returns {Promise<Object>} Holland Code recommendations
     */
    async getHollandCodeRecommendations(hollandCode) {
        try {
            // Code should already be normalized from the form
            const docRef = doc(this.db, 'holland_codes', hollandCode);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.warn(`No recommendations found for Holland Code: ${hollandCode}`);
                return {
                    jobs: [],
                    description: `No specific recommendations found for Holland Code: ${hollandCode}. Please try a different combination.`
                };
            }
            
            return docSnap.data();
        } catch (error) {
            console.error('Error getting Holland Code recommendations:', error);
            return {
                jobs: [],
                description: 'Unable to retrieve recommendations at this time. Please try again later.'
            };
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

    /**
     * Get training recommendations based on experience level
     * @param {string} role - Role or job title
     * @param {number} experience - Years of experience
     * @returns {Promise<Array>} Training recommendations
     */
    async getTrainingRecommendations(role, experience) {
        try {
            const skillLevel = experience < 2 ? 'entry' : experience < 5 ? 'mid' : 'senior';
            const querySnapshot = await getDocs(collection(this.db, 'training_resources'));
            
            if (querySnapshot.empty) {
                console.warn('No training resources found');
                return [];
            }

            const recommendations = [];
            querySnapshot.forEach(doc => {
                const course = doc.data();
                if (!course.level || course.level === skillLevel || course.level === 'all') {
                    recommendations.push(course);
                }
            });

            return recommendations;
        } catch (error) {
            console.error('Error getting training recommendations:', error);
            return [];
        }
    }
}

// Export a singleton instance
export const careerRecommendationService = new CareerRecommendationService();
