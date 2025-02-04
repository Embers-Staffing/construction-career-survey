'use strict';

/**
 * Technical construction career details
 * @type {Object.<string, Object>}
 */
export const technicalCareers = {
    'Construction Estimator': {
        description: 'A Construction Estimator in Canada calculates project costs considering regional factors, material availability, and provincial labor rates.',
        education: {
            degrees: [
                'Diploma in Construction Management or Estimating',
                'Bachelor\'s degree in Construction Management or Engineering'
            ],
            schools: [
                {
                    name: 'NAIT',
                    program: 'Construction Engineering Technology',
                    link: 'https://www.nait.ca/programs/construction-engineering-technology'
                },
                {
                    name: 'Conestoga College',
                    program: 'Construction Project Management',
                    link: 'https://www.conestogac.on.ca/fulltime/construction-project-management'
                }
            ]
        },
        certifications: [
            'Gold Seal Certified (GSC) Estimator',
            'Professional Quantity Surveyor (PQS)',
            'Canadian Institute of Quantity Surveyors (CIQS) Designation'
        ],
        skills: {
            technical: [
                'Canadian Construction Costs',
                'Blueprint Reading',
                'Quantity Takeoff',
                'Construction Methods',
                'Material Pricing'
            ],
            soft: [
                'Analytical Thinking',
                'Attention to Detail',
                'Communication',
                'Time Management',
                'Negotiation'
            ]
        },
        salary: {
            entry: '$60,000 - $75,000 CAD',
            mid: '$75,000 - $95,000 CAD',
            senior: '$95,000 - $120,000 CAD',
            source: 'Based on Canadian Job Bank data 2025'
        },
        responsibilities: [
            'Prepare cost estimates for Canadian projects',
            'Consider regional factors and requirements',
            'Research material and labor costs',
            'Prepare bid proposals',
            'Review subcontractor quotes'
        ],
        industryTrends: [
            'Canadian cost database integration',
            'BIM estimation tools',
            'Regional pricing analytics',
            'Sustainable material costing'
        ],
        careerPath: {
            entry: 'Junior Estimator',
            mid: 'Senior Estimator',
            senior: 'Chief Estimator',
            executive: 'Director of Preconstruction'
        }
    }
};
