'use strict';

import { getCareerDetails as getDetailedCareerInfo } from './careers/index.js';

export const careerData = {
    recommendations: {
        'ISTJ': ['Project Manager', 'Construction Superintendent', 'Building Inspector'],
        'ISFJ': ['Safety Manager', 'Quality Control Inspector', 'Construction Administrator'],
        'INFJ': ['Sustainability Consultant', 'Architecture Designer', 'Environmental Specialist'],
        'INTJ': ['Civil Engineer', 'Construction Technology Specialist', 'Project Controls Manager'],
        'ISTP': ['Heavy Equipment Operator', 'Electrician', 'Mechanical Technician'],
        'ISFP': ['Interior Designer', 'Landscape Designer', 'Architectural Drafter'],
        'INFP': ['Environmental Consultant', 'Green Building Specialist', 'Architectural Designer'],
        'INTP': ['Structural Engineer', 'BIM Specialist', 'Construction Software Developer'],
        'ESTP': ['Construction Foreman', 'Site Supervisor', 'Equipment Manager'],
        'ESFP': ['Real Estate Developer', 'Sales Representative', 'Client Relations Manager'],
        'ENFP': ['Business Development Manager', 'Marketing Coordinator', 'Sustainability Consultant'],
        'ENTP': ['Construction Innovation Manager', 'Project Development Manager', 'Technology Consultant'],
        'ESTJ': ['Construction Manager', 'Operations Director', 'Contracts Manager'],
        'ESFJ': ['Construction Safety Officer', 'Human Resources Manager', 'Client Service Manager'],
        'ENFJ': ['Training Manager', 'Team Development Lead', 'Community Relations Manager'],
        'ENTJ': ['Executive Construction Manager', 'Company Owner', 'Strategic Planning Director']
    }
};

export function getRecommendations(mbtiType) {
    return careerData.recommendations[mbtiType] || [];
}

export function getCareerDetails(careerPath) {
    return getDetailedCareerInfo(careerPath);
}
