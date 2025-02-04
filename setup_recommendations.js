'use strict';

import { firebaseConfig } from './config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initial recommendations data
const recommendations = {
    holland_codes: {
        'RIA': {
            job_titles: [
                'Construction Project Manager',
                'Site Superintendent',
                'Civil Engineer'
            ],
            description: 'These roles combine practical, hands-on work with analytical thinking and leadership.',
            skills_needed: [
                'Project Management',
                'Technical Drawing',
                'Building Codes',
                'Leadership',
                'Problem Solving'
            ]
        },
        'RIE': {
            job_titles: [
                'Construction Technology Specialist',
                'BIM Coordinator',
                'Construction Safety Engineer'
            ],
            description: 'These positions focus on implementing and managing construction technologies and safety systems.',
            skills_needed: [
                'CAD/BIM Software',
                'Safety Regulations',
                'Technology Integration',
                'Data Analysis',
                'System Design'
            ]
        },
        'RSE': {
            job_titles: [
                'Construction Estimator',
                'Quality Control Manager',
                'Building Inspector'
            ],
            description: 'These roles involve detailed analysis and ensuring compliance with standards.',
            skills_needed: [
                'Cost Estimation',
                'Quality Control',
                'Regulatory Compliance',
                'Documentation',
                'Attention to Detail'
            ]
        }
    },
    mbti_types: {
        'ISTJ': {
            job_titles: [
                'Construction Inspector',
                'Quality Assurance Manager',
                'Project Controller'
            ],
            description: 'Detail-oriented roles that require systematic thinking and adherence to standards.',
            strengths: [
                'Attention to Detail',
                'Reliability',
                'Systematic Approach',
                'Organization',
                'Following Procedures'
            ]
        },
        'ESTP': {
            job_titles: [
                'Site Supervisor',
                'Equipment Manager',
                'Field Operations Manager'
            ],
            description: 'Hands-on roles that require quick thinking and adaptability in dynamic environments.',
            strengths: [
                'Problem Solving',
                'Crisis Management',
                'Team Leadership',
                'Adaptability',
                'Quick Decision Making'
            ]
        },
        'ENTJ': {
            job_titles: [
                'Construction Executive',
                'Project Director',
                'Development Manager'
            ],
            description: 'Leadership roles that involve strategic planning and team management.',
            strengths: [
                'Strategic Planning',
                'Leadership',
                'Decision Making',
                'Team Building',
                'Goal Setting'
            ]
        }
    }
};

// Function to populate the database
async function populateRecommendations() {
    try {
        console.log('Starting to populate recommendations...');
        
        // Add Holland Code recommendations
        const hollandCodesRef = collection(db, 'holland_codes');
        for (const [code, data] of Object.entries(recommendations.holland_codes)) {
            await setDoc(doc(hollandCodesRef, code), {
                ...data,
                code: code,
                type: 'holland_code'
            });
            console.log(`Added Holland Code recommendations for ${code}`);
        }
        
        // Add MBTI recommendations
        const mbtiTypesRef = collection(db, 'mbti_types');
        for (const [type, data] of Object.entries(recommendations.mbti_types)) {
            await setDoc(doc(mbtiTypesRef, type), {
                ...data,
                type: type,
                category: 'mbti'
            });
            console.log(`Added MBTI recommendations for ${type}`);
        }
        
        console.log('✅ Successfully populated all recommendations!');
    } catch (error) {
        console.error('❌ Error populating recommendations:', error);
        console.error('Error details:', error.code, error.message);
    }
}

// Run the population script
console.log('Starting database population...');
populateRecommendations();
