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
                
                // Default recommendations based on first two letters
                const defaultRecs = {
                    'IN': ['Construction Planner', 'BIM Specialist', 'Quality Assurance Manager'],
                    'IS': ['Building Inspector', 'Materials Specialist', 'Documentation Specialist'],
                    'EN': ['Project Manager', 'Business Developer', 'Client Relations Manager'],
                    'ES': ['Site Supervisor', 'Team Leader', 'Operations Manager']
                };

                const type = mbtiType.substring(0, 2);
                return {
                    jobs: defaultRecs[type] || ['Project Coordinator', 'Construction Manager', 'Quality Inspector'],
                    description: `Based on your personality type (${mbtiType}), these roles match your work style and strengths in construction.`
                };
            }
            
            return docSnap.data();
        } catch (error) {
            console.error('Error getting MBTI recommendations:', error);
            return {
                jobs: ['Project Coordinator', 'Construction Manager', 'Quality Inspector'],
                description: 'These versatile roles offer opportunities to leverage various personality strengths.'
            };
        }
    }

    /**
     * Get Holland Code recommendations
     * @param {string} hollandCode - Holland Code (e.g., 'RIA')
     * @returns {Promise<Object>} Holland Code recommendations
     */
    async getHollandCodeRecommendations(hollandCode) {
        try {
            const docRef = doc(this.db, 'holland_codes', hollandCode);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.warn(`No recommendations found for Holland Code: ${hollandCode}`);
                
                // Default recommendations based on first letter
                const primaryType = hollandCode[0];
                const defaultRecs = {
                    'R': ['Construction Site Manager', 'Equipment Operator', 'Safety Inspector'],
                    'I': ['Building Systems Engineer', 'Construction Estimator', 'Project Planner'],
                    'A': ['Interior Designer', 'Architectural Drafter', 'Landscape Designer'],
                    'S': ['Construction Trainer', 'Safety Coordinator', 'Team Supervisor'],
                    'E': ['Construction Project Manager', 'Business Development Manager', 'General Contractor'],
                    'C': ['Quality Control Inspector', 'Building Code Inspector', 'Construction Administrator']
                };

                return {
                    jobs: defaultRecs[primaryType] || ['Project Manager', 'Site Supervisor', 'Safety Coordinator'],
                    description: `Based on your primary interest type (${primaryType}), these roles align with your preferences while offering opportunities in construction.`
                };
            }
            
            return docSnap.data();
        } catch (error) {
            console.error('Error getting Holland Code recommendations:', error);
            return {
                jobs: ['Project Manager', 'Site Supervisor', 'Safety Coordinator'],
                description: 'These are general construction roles that offer various opportunities for growth.'
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
     * @param {Object} data - Survey response data including recommendations
     * @returns {Promise<string>} ID of the stored survey response
     */
    async storeSurveyResponse(data) {
        try {
            // Ensure all fields have valid values
            const response = {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                birthYear: data.birthYear || 0,
                birthMonth: data.birthMonth || 0,
                age: data.age || 0,
                constructionExperience: data.constructionExperience || 0,
                hollandCode: data.hollandCode || '',
                mbtiType: data.mbtiType || '',
                recommendations: {
                    hollandJobs: data.recommendations?.hollandJobs || [],
                    mbtiJobs: data.recommendations?.mbtiJobs || [],
                    hollandDescription: data.recommendations?.hollandDescription || '',
                    mbtiDescription: data.recommendations?.mbtiDescription || ''
                },
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
     * @returns {Promise<Array<string>>} Training recommendations
     */
    async getTrainingRecommendations(role, experience) {
        try {
            const skillLevel = experience < 2 ? 'entry' : experience < 5 ? 'mid' : 'senior';
            const querySnapshot = await getDocs(collection(this.db, 'training_resources'));
            
            if (querySnapshot.empty) {
                console.warn('No training resources found');
                return [
                    'OSHA Safety Training',
                    'Basic Construction Methods',
                    'Construction Math and Measurements',
                    'Blueprint Reading Fundamentals',
                    'Tool and Equipment Safety'
                ];
            }

            const recommendations = [];
            querySnapshot.forEach(doc => {
                const course = doc.data();
                if (!course.level || course.level === skillLevel || course.level === 'all') {
                    // Format the recommendation nicely
                    const rec = course.title || course.name;
                    if (rec) {
                        recommendations.push(rec);
                    }
                }
            });

            // If no recommendations found, return default list
            if (recommendations.length === 0) {
                return [
                    'OSHA Safety Training',
                    'Basic Construction Methods',
                    'Construction Math and Measurements',
                    'Blueprint Reading Fundamentals',
                    'Tool and Equipment Safety'
                ];
            }

            return recommendations;
        } catch (error) {
            console.error('Error getting training recommendations:', error);
            // Return default recommendations on error
            return [
                'OSHA Safety Training',
                'Basic Construction Methods',
                'Construction Math and Measurements',
                'Blueprint Reading Fundamentals',
                'Tool and Equipment Safety'
            ];
        }
    }
}

// Export a singleton instance
export const careerRecommendationService = new CareerRecommendationService();
