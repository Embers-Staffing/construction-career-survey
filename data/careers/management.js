'use strict';

/**
 * Management-level construction career details
 * @type {Object.<string, Object>}
 */
export const managementCareers = {
    'Client Relations Director': {
        description: 'A Client Relations Director in construction manages and develops key client relationships across Canadian construction projects, ensuring client satisfaction and business growth.',
        education: {
            degrees: [
                'Bachelor\'s degree in Construction Management, Business Administration, or related field',
                'Master\'s degree preferred (MBA or Construction Management)'
            ],
            schools: [
                {
                    name: 'University of Calgary',
                    program: 'Certificate in Professional Management - Construction Management',
                    link: 'https://conted.ucalgary.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=1706219'
                },
                {
                    name: 'University of Alberta',
                    program: 'Construction Management Certificate',
                    link: 'https://coned.ualberta.ca/public/category/courseCategoryCertificateProfile.do?method=load&certificateId=1031825'
                }
            ]
        },
        certifications: [
            'Gold Seal Certified (GSC) Project Manager',
            'Project Management Professional (PMP)',
            'Construction Management Association of Canada (CMAC) Designation'
        ],
        skills: {
            technical: [
                'Construction Project Management Software',
                'CRM Systems',
                'Contract Management',
                'Project Planning Tools',
                'Business Development Strategies'
            ],
            soft: [
                'Strategic Relationship Building',
                'Negotiation',
                'Communication',
                'Leadership',
                'Problem-solving'
            ]
        },
        salary: {
            entry: '$75,000 - $95,000 CAD',
            mid: '$95,000 - $140,000 CAD',
            senior: '$140,000 - $180,000 CAD',
            source: 'Based on Canadian Job Bank data 2025'
        },
        responsibilities: [
            'Develop and maintain client relationships across Canadian provinces',
            'Lead client communication strategy',
            'Ensure project satisfaction and quality assurance',
            'Drive business growth in Western Canada',
            'Collaborate with project teams across provinces'
        ],
        industryTrends: [
            'Growing emphasis on sustainable construction practices',
            'Increased use of digital collaboration tools',
            'Focus on data-driven client satisfaction metrics',
            'Integration of virtual reality for project visualization'
        ],
        careerPath: {
            entry: 'Client Relations Manager',
            mid: 'Senior Client Relations Manager',
            senior: 'Client Relations Director',
            executive: 'VP of Client Relations'
        }
    },
    'Construction Project Manager': {
        description: 'A Construction Project Manager in Canada oversees construction projects from planning to completion, ensuring compliance with provincial building codes and regulations.',
        education: {
            degrees: [
                'Bachelor\'s degree in Construction Management, Civil Engineering, or related field',
                'Diploma in Construction Management from recognized Canadian institution'
            ],
            schools: [
                {
                    name: 'BCIT',
                    program: 'Building Construction Technology Certificate',
                    link: 'https://www.bcit.ca/programs/building-construction-technology-associate-certificate-part-time-515gacert/'
                },
                {
                    name: 'NAIT',
                    program: 'Construction Engineering Technology',
                    link: 'https://www.nait.ca/programs/construction-engineering-technology'
                }
            ]
        },
        certifications: [
            'Gold Seal Certified (GSC) Project Manager',
            'Professional Engineer (P.Eng)',
            'LEED Accredited Professional'
        ],
        skills: {
            technical: [
                'Canadian Building Codes',
                'Cost Estimation and Budgeting',
                'Contract Management',
                'Building Information Modeling (BIM)',
                'Construction Management Software'
            ],
            soft: [
                'Leadership',
                'Problem-solving',
                'Communication',
                'Risk Management',
                'Team Coordination'
            ]
        },
        salary: {
            entry: '$65,000 - $85,000 CAD',
            mid: '$85,000 - $120,000 CAD',
            senior: '$120,000 - $155,000 CAD',
            source: 'Based on WorkBC and Job Bank data 2025'
        },
        responsibilities: [
            'Oversee project planning and execution',
            'Ensure compliance with provincial regulations',
            'Manage budgets and resources',
            'Coordinate with stakeholders',
            'Monitor project progress and quality'
        ],
        industryTrends: [
            'Adoption of Canadian construction standards',
            'Sustainable building practices',
            'Cold climate construction techniques',
            'Remote project management tools'
        ],
        careerPath: {
            entry: 'Assistant Project Manager',
            mid: 'Project Manager',
            senior: 'Senior Project Manager',
            executive: 'Director of Construction'
        }
    }
};
