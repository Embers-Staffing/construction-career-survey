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
        "description": "People with RIA (Realistic, Investigative, Artistic) preferences excel in hands-on leadership roles that require technical knowledge and creative problem-solving. They are well-suited for positions that combine practical skills with planning and design elements."
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
        "description": "RIE (Realistic, Investigative, Enterprising) types thrive in roles that combine technical expertise with management responsibilities. They excel at analyzing problems and implementing practical solutions while leading teams."
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
        "description": "RSE (Realistic, Social, Enterprising) individuals excel in roles that combine practical skills with team leadership. They are natural at managing people while maintaining hands-on involvement in projects."
    }
    # Add more Holland Code combinations as needed
}

# MBTI Recommendations
MBTI_RECOMMENDATIONS: Dict[str, Dict] = {
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
        "description": "ISTJs excel in roles requiring attention to detail, systematic thinking, and adherence to standards. They make excellent managers and inspectors in construction due to their methodical approach and reliability."
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
        "description": "ESTPs thrive in dynamic, hands-on roles that require quick thinking and adaptability. They excel in positions that involve active problem-solving and direct oversight of operations."
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
        "description": "ENTJs excel in leadership positions that require strategic thinking and long-term planning. They are natural leaders who can effectively manage large-scale construction projects and organizations."
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
        "description": "ESFPs excel in roles that involve direct interaction with people and hands-on work. They are natural problem solvers who can think on their feet and adapt quickly to changing situations on construction sites."
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
        "description": "ISFJs excel in roles that require attention to detail, organization, and supporting others. They are reliable and thorough in maintaining safety and quality standards."
    },
    "ENFJ": {
        "jobs": [
            "Training Manager",
            "HR Director",
            "Team Development Lead",
            "Project Communications Manager",
            "Community Relations Director",
            "Safety Program Manager",
            "Workforce Development Manager"
        ],
        "description": "ENFJs excel in roles focused on developing and supporting teams. They are natural leaders who can effectively manage and motivate construction teams while maintaining positive relationships."
    }
}

def populate_recommendations():
    """
    Populate the Firestore database with recommendations for both Holland Codes and MBTI types.
    """
    # Populate Holland Code recommendations
    holland_collection = db.collection('recommendations').document('holland_codes')
    holland_collection.set({
        'codes': HOLLAND_RECOMMENDATIONS
    })
    print(" Holland Code recommendations populated")

    # Populate MBTI recommendations
    mbti_collection = db.collection('recommendations').document('mbti_types')
    mbti_collection.set({
        'types': MBTI_RECOMMENDATIONS
    })
    print(" MBTI recommendations populated")

def verify_recommendations():
    """
    Verify that recommendations were properly stored in the database.
    """
    # Verify Holland Codes
    holland_doc = db.collection('recommendations').document('holland_codes').get()
    if holland_doc.exists:
        print(" Holland Code recommendations verified")
    else:
        print(" Holland Code recommendations missing")

    # Verify MBTI types
    mbti_doc = db.collection('recommendations').document('mbti_types').get()
    if mbti_doc.exists:
        print(" MBTI recommendations verified")
    else:
        print(" MBTI recommendations missing")

if __name__ == "__main__":
    print(" Starting recommendations setup...")
    populate_recommendations()
    print("\n Verifying recommendations...")
    verify_recommendations()
    print("\n Setup complete!")
