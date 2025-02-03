'use strict';

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
    },
    careerPaths: {
        'Project Manager': {
            skills: ['Leadership', 'Planning', 'Budgeting', 'Communication', 'Problem-solving'],
            salary: '$70,000 - $130,000',
            growth: 'High demand with 11% growth projected',
            progression: [
                'Assistant Project Manager (0-3 years)',
                'Project Manager (3-7 years)',
                'Senior Project Manager (7-12 years)',
                'Program Manager (12+ years)'
            ],
            training: [
                'PMP Certification',
                'Construction Management degree',
                'OSHA Safety Certification',
                'Leadership training'
            ]
        },
        'Construction Superintendent': {
            skills: ['Site Management', 'Safety Protocols', 'Team Leadership', 'Technical Knowledge'],
            salary: '$65,000 - $120,000',
            growth: 'Steady growth with 10% increase expected',
            progression: [
                'Assistant Superintendent (0-3 years)',
                'Superintendent (3-8 years)',
                'Senior Superintendent (8-15 years)',
                'General Superintendent (15+ years)'
            ],
            training: [
                'OSHA 30-Hour Certification',
                'First Aid/CPR Certification',
                'Construction Management courses',
                'Leadership Development'
            ]
        }
        // Add more career paths as needed
    }
};

export const getRecommendations = (mbtiType) => {
    return careerData.recommendations[mbtiType] || [];
};

export const getCareerDetails = (careerPath) => {
    return careerData.careerPaths[careerPath] || null;
};
