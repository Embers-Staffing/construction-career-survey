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
        ],
        "description": "ISTJs excel in roles requiring attention to detail, systematic thinking, and adherence to standards."
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
        ],
        "description": "ESTPs thrive in dynamic, hands-on roles that require quick thinking and adaptability."
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
        ],
        "description": "ENTJs excel in leadership positions that require strategic thinking and long-term planning."
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
        ],
        "description": "ESFPs excel in roles that involve direct interaction with people and hands-on work."
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
        ],
        "description": "ISFPs excel in roles that combine practical skills with aesthetic awareness and attention to detail."
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
        ],
        "description": "ISFJs excel in roles that require attention to detail, organization, and supporting others."
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
        ],
        "description": "ENFJs excel in roles focused on developing teams, fostering communication, and leading with empathy in construction."
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
        ],
        "description": "ENFPs excel in roles that involve creative problem-solving, relationship building, and driving innovation in construction."
    }
}

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
            db.collection('holland_codes').document(code).set({
                'jobs': data['jobs'],
                'description': data['description']
            })

        # Populate MBTI recommendations
        print(" MBTI recommendations populated")
        for type_code, data in MBTI_RECOMMENDATIONS.items():
            db.collection('mbti_types').document(type_code).set({
                'jobs': data['jobs'],
                'description': data['description']
            })

        print("\n Verifying recommendations...")
        
        # Verify Holland Code recommendations
        for code in HOLLAND_RECOMMENDATIONS.keys():
            doc = db.collection('holland_codes').document(code).get()
            if not doc.exists:
                raise Exception(f"Holland Code {code} not found in database")
        print(" Holland Code recommendations verified")

        # Verify MBTI recommendations
        for type_code in MBTI_RECOMMENDATIONS.keys():
            doc = db.collection('mbti_types').document(type_code).get()
            if not doc.exists:
                raise Exception(f"MBTI type {type_code} not found in database")
        print(" MBTI recommendations verified")

        print("\n Setup complete!")

    except Exception as e:
        print(f"\n Error during setup: {str(e)}")
        raise e

if __name__ == '__main__':
    populate_recommendations()
