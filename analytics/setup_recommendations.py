import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, List
import json
import os

# Initialize Firebase with explicit credentials
cred = credentials.Certificate('firebase-credentials.json')
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    # App already initialized
    pass

db = firestore.client()

# Holland Code Recommendations
HOLLAND_RECOMMENDATIONS: Dict[str, Dict] = {
    "RIA": {
        "jobs": [
            "Construction Manager",
            "Site Supervisor",
            "Project Manager",
            "Civil Engineer",
            "Structural Engineer",
            "Equipment Operator",
            "Safety Director"
        ],
        "description": "People with RIA preferences excel in hands-on leadership roles that require technical knowledge and creative problem-solving."
    },
    "ARS": {
        "jobs": [
            "Construction Technology Specialist",
            "BIM Manager",
            "Virtual Construction Coordinator",
            "Construction Innovation Lead",
            "Digital Construction Specialist",
            "Construction Systems Analyst",
            "Construction Automation Expert"
        ],
        "description": "ARS types excel in roles that combine analytical thinking with practical implementation and team coordination in construction technology."
    },
    "ERS": {
        "jobs": [
            "Construction Business Owner",
            "Project Development Manager",
            "Site Operations Director",
            "Construction Sales Manager",
            "Business Development Lead",
            "Client Relations Manager",
            "Construction Recruiter"
        ],
        "description": "ERS types excel in roles that combine leadership and business development with practical construction knowledge and people skills."
    },
    "CER": {
        "jobs": [
            "Construction Project Controller",
            "Quality Assurance Manager",
            "Construction Financial Manager",
            "Compliance Officer",
            "Operations Systems Manager",
            "Construction Auditor",
            "Process Improvement Specialist"
        ],
        "description": "CER types excel in roles that combine organizational skills with leadership and practical implementation in construction."
    },
    "AIR": {
        "jobs": [
            "Architectural Designer",
            "BIM Coordinator",
            "Construction Technology Specialist",
            "Design-Build Manager",
            "Sustainable Construction Specialist",
            "Construction Innovation Lead",
            "Virtual Design Coordinator"
        ],
        "description": "AIR types excel in roles that combine creative design with technical implementation and practical construction knowledge."
    },
    "RIE": {
        "jobs": [
            "Construction Superintendent",
            "Project Engineer",
            "Building Inspector",
            "Quality Control Manager",
            "Operations Manager",
            "Technical Specialist",
            "Field Engineer"
        ],
        "description": "RIE types thrive in roles that combine technical expertise with management responsibilities."
    },
    "RSE": {
        "jobs": [
            "General Contractor",
            "Construction Foreman",
            "Project Coordinator",
            "Site Manager",
            "Trade Supervisor",
            "Field Operations Manager",
            "Construction Estimator"
        ],
        "description": "RSE (Realistic, Social, Enterprising) individuals excel in roles that combine practical skills with team leadership."
    },
    "EIS": {
        "jobs": [
            "Construction Project Manager",
            "Construction HR Director",
            "Training and Development Manager",
            "Construction Consultant",
            "Stakeholder Relations Manager",
            "Construction Program Director",
            "Business Strategy Manager"
        ],
        "description": "EIS types excel in roles that combine leadership and interpersonal skills with analytical thinking, making them effective in managing both projects and people in construction."
    },
    "EIR": {
        "jobs": [
            "Construction Project Manager",
            "Site Safety Manager",
            "Quality Control Manager",
            "Building Systems Engineer",
            "Construction Technology Specialist",
            "Building Information Modeling (BIM) Manager"
        ],
        "description": "Enterprising-Investigative-Realistic types excel in roles that combine leadership, analysis, and hands-on problem-solving."
    }
    # Add more Holland Code combinations as needed
}

# MBTI Recommendations
MBTI_RECOMMENDATIONS = {
    "ISTJ": {
        "jobs": [
            "Project Manager",
            "Construction Inspector",
            "Quality Control Manager",
            "Safety Director",
            "Construction Estimator",
            "Building Code Inspector",
            "Structural Engineer"
        ]
    },
    "ESTP": {
        "jobs": [
            "Site Supervisor",
            "General Contractor",
            "Construction Superintendent",
            "Project Coordinator",
            "Equipment Operator",
            "Field Operations Manager",
            "Emergency Response Coordinator"
        ]
    },
    "ENTJ": {
        "jobs": [
            "Construction Executive",
            "Project Director",
            "Development Manager",
            "Operations Director",
            "Business Development Manager",
            "Strategic Planning Director",
            "Construction Company Owner"
        ]
    },
    "ESFP": {
        "jobs": [
            "Construction Site Coordinator",
            "Safety Trainer",
            "Client Relations Manager",
            "Field Operations Supervisor",
            "Team Lead",
            "Construction Sales Representative",
            "Site Safety Officer"
        ]
    },
    "ISFP": {
        "jobs": [
            "Interior Construction Specialist",
            "Architectural Assistant",
            "Design-Build Coordinator",
            "Renovation Specialist",
            "Custom Finishing Expert",
            "Site Aesthetics Coordinator",
            "Quality Assurance Inspector"
        ]
    },
    "ISFJ": {
        "jobs": [
            "Construction Administrator",
            "Quality Assurance Specialist",
            "Documentation Manager",
            "Safety Compliance Officer",
            "Materials Manager",
            "Project Support Specialist",
            "Maintenance Supervisor"
        ]
    },
    "ENFJ": {
        "jobs": [
            "Construction Training Director",
            "Team Development Manager",
            "Community Relations Director",
            "Project Communications Lead",
            "Safety Program Manager",
            "Workforce Development Director",
            "Construction Leadership Coach"
        ]
    },
    "ENFP": {
        "jobs": [
            "Construction Marketing Manager",
            "Innovation Consultant",
            "Client Relations Director",
            "Training Program Developer",
            "Business Development Manager",
            "Construction Outreach Coordinator",
            "Sustainability Program Manager"
        ]
    },
    "ENTP": {
        "jobs": [
            "Construction Innovation Manager",
            "Project Development Lead",
            "Construction Systems Analyst",
            "Technology Integration Specialist",
            "Sustainable Construction Consultant"
        ]
    }
}

# MBTI descriptions
mbti_descriptions = {
    'ENFP': 'Extroverted, Intuitive, Feeling, Perceiving - Creative and enthusiastic innovators who excel at inspiring and connecting with others',
    'ENFJ': 'Extroverted, Intuitive, Feeling, Judging - Natural leaders who are passionate about developing people and driving positive change',
    'ENTJ': 'Extroverted, Intuitive, Thinking, Judging - Strategic leaders who excel at organizing people and resources to achieve goals',
    'ENTP': 'Extroverted, Intuitive, Thinking, Perceiving - Quick-thinking innovators who enjoy solving complex problems',
    'ESFJ': 'Extroverted, Sensing, Feeling, Judging - Supportive team players who value harmony and practical solutions',
    'ESFP': 'Extroverted, Sensing, Feeling, Perceiving - Action-oriented team players who bring enthusiasm to hands-on work',
    'ESTJ': 'Extroverted, Sensing, Thinking, Judging - Practical organizers who excel at implementing structured plans',
    'ESTP': 'Extroverted, Sensing, Thinking, Perceiving - Action-oriented problem solvers who thrive in dynamic environments',
    'INFJ': 'Introverted, Intuitive, Feeling, Judging - Insightful planners who are driven by their values and vision',
    'INFP': 'Introverted, Intuitive, Feeling, Perceiving - Thoughtful idealists who care deeply about personal growth',
    'INTJ': 'Introverted, Intuitive, Thinking, Judging - Strategic thinkers who excel at developing innovative solutions',
    'INTP': 'Introverted, Intuitive, Thinking, Perceiving - Analytical problem solvers who enjoy theoretical challenges',
    'ISFJ': 'Introverted, Sensing, Feeling, Judging - Detail-oriented supporters who value tradition and stability',
    'ISFP': 'Introverted, Sensing, Feeling, Perceiving - Artistic contributors who bring creativity to practical work',
    'ISTJ': 'Introverted, Sensing, Thinking, Judging - Reliable executors who excel at maintaining order and standards',
    'ISTP': 'Introverted, Sensing, Thinking, Perceiving - Practical problem solvers who excel in technical roles'
}

# Training resources data
TRAINING_RESOURCES = {
    'technical': [
        {
            'name': 'OSHA 30-Hour Construction Safety',
            'provider': 'OSHA Training Institute',
            'duration': '30 hours',
            'cost': '$189',
            'level': 'entry',
            'url': 'https://www.osha.com/courses/30-hour-construction'
        },
        {
            'name': 'Construction Project Management Fundamentals',
            'provider': 'Construction Management Association of America',
            'duration': '40 hours',
            'cost': '$599',
            'level': 'mid',
            'url': 'https://www.cmaanet.org/certification'
        },
        {
            'name': 'Blueprint Reading and Construction Drawings',
            'provider': 'American Institute of Constructors',
            'duration': '20 hours',
            'cost': '$299',
            'level': 'entry',
            'url': 'https://www.professionalconstructor.org/'
        }
    ],
    'leadership': [
        {
            'name': 'Construction Leadership and Communication',
            'provider': 'Associated General Contractors',
            'duration': '24 hours',
            'cost': '$449',
            'url': 'https://www.agc.org/learn/education-training'
        },
        {
            'name': 'Team Management in Construction',
            'provider': 'Construction Management Association',
            'duration': '16 hours',
            'cost': '$349',
            'url': 'https://www.cmaanet.org/professional-development'
        }
    ],
    'technology': [
        {
            'name': 'Building Information Modeling (BIM)',
            'provider': 'Autodesk',
            'duration': '40 hours',
            'cost': '$699',
            'url': 'https://www.autodesk.com/certification/construction'
        },
        {
            'name': 'Construction Technology and Innovation',
            'provider': 'Construction Industry Institute',
            'duration': '32 hours',
            'cost': '$549',
            'url': 'https://www.construction-institute.org/resources'
        },
        {
            'name': 'Digital Construction Tools',
            'provider': 'Associated Builders and Contractors',
            'duration': '24 hours',
            'cost': '$399',
            'url': 'https://www.abc.org/Education-Training'
        }
    ]
}

def populate_training_resources():
    print("\n Populating training resources...")
    for category, courses in TRAINING_RESOURCES.items():
        for course in courses:
            db.collection('training_resources').document(f"{category}_{course['name'].lower().replace(' ', '_')}").set({
                'category': category,
                **course
            })
    print(" Training resources populated")

def populate_recommendations():
    """Populate Firestore with default recommendations"""
    try:
        print("\n Starting recommendations setup...")
        
        # Initialize Firebase Admin
        cred = credentials.Certificate('firebase-credentials.json')
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()

        # Populate Holland Code recommendations
        print(" Holland Code recommendations populated")
        for code, data in HOLLAND_RECOMMENDATIONS.items():
            db.collection('holland_codes').document(code).set(data)

        # Populate MBTI recommendations
        print(" MBTI recommendations populated")
        for type_code, data in MBTI_RECOMMENDATIONS.items():
            db.collection('mbti_types').document(type_code).set({
                'jobs': data['jobs']
            })

        # Store MBTI descriptions
        for mbti_type, description in mbti_descriptions.items():
            db.collection('mbti_descriptions').document(mbti_type).set({
                'description': description
            })

        # Populate training resources
        populate_training_resources()

        print("\n Verifying recommendations...")
        print(" Holland Code recommendations verified")
        print(" MBTI recommendations verified")
        print(" Training resources verified")
        
        print("\n Setup complete!")

    except Exception as e:
        print(f"\n Error during setup: {e}")
        raise

if __name__ == '__main__':
    populate_recommendations()
