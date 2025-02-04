'use strict';

/**
 * Safety-related construction career details
 * @type {Object.<string, Object>}
 */
export const safetyCareers = {
    'Safety Director': {
        description: 'A Safety Director in Canadian construction develops and implements safety programs compliant with provincial OH&S regulations.',
        education: {
            degrees: [
                'Bachelor\'s degree in Occupational Health and Safety or related field',
                'Diploma in Occupational Health and Safety'
            ],
            schools: [
                {
                    name: 'University of Alberta',
                    program: 'Occupational Health & Safety Certificate',
                    link: 'https://www.ualberta.ca/extension/continuing-education/programs/occupational-health-and-safety/index.html'
                },
                {
                    name: 'BCIT',
                    program: 'Occupational Health and Safety Certificate',
                    link: 'https://www.bcit.ca/programs/occupational-health-and-safety-certificate-part-time-5020cert/'
                }
            ]
        },
        certifications: [
            'Canadian Registered Safety Professional (CRSP)',
            'National Construction Safety Officer (NCSO)',
            'Provincial Safety Certification'
        ],
        skills: {
            technical: [
                'Provincial OH&S Regulations',
                'Safety Program Development',
                'Accident Investigation',
                'Risk Assessment',
                'Safety Training'
            ],
            soft: [
                'Leadership',
                'Communication',
                'Problem-solving',
                'Detail-oriented',
                'Training and Development'
            ]
        },
        salary: {
            entry: '$80,000 - $95,000 CAD',
            mid: '$95,000 - $120,000 CAD',
            senior: '$120,000 - $150,000 CAD',
            source: 'Based on BCRSP and Job Bank data 2025'
        },
        responsibilities: [
            'Develop safety programs compliant with provincial regulations',
            'Conduct safety training',
            'Ensure OH&S compliance',
            'Investigate incidents',
            'Maintain safety documentation'
        ],
        industryTrends: [
            'Digital safety management systems',
            'Cold weather safety protocols',
            'Mental health and wellness programs',
            'Virtual reality safety training'
        ],
        careerPath: {
            entry: 'Safety Coordinator',
            mid: 'Safety Manager',
            senior: 'Safety Director',
            executive: 'VP of Safety'
        }
    }
};
