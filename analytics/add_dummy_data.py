import firebase_admin
from firebase_admin import firestore
from datetime import datetime, timedelta
import random
from config import init_firebase

# Initialize Firebase
init_firebase()
db = firestore.client()

# Sample data
holland_codes = ['RIASEC', 'AISECR', 'SECRIA', 'ECRISA', 'CSERIA']
mbti_types = ['INTJ', 'ENTJ', 'ISFP', 'ESFJ', 'ISTP']
job_titles = [
    'Construction Manager',
    'Civil Engineer',
    'Architect',
    'Project Manager',
    'Safety Coordinator',
    'Electrician',
    'Carpenter',
    'HVAC Technician',
    'Plumber',
    'Site Supervisor'
]

# Generate dummy responses
num_responses = 50
base_date = datetime.now() - timedelta(days=30)

for i in range(num_responses):
    # Generate random timestamp within last 30 days
    timestamp = base_date + timedelta(
        days=random.randint(0, 30),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59)
    )
    
    # Generate random recommendations
    holland_recommendations = random.sample(job_titles, k=3)
    mbti_recommendations = random.sample(job_titles, k=3)
    
    # Create response document
    response_data = {
        'timestamp': timestamp,
        'status': 'completed',
        'holland_code': random.choice(holland_codes),
        'mbti_type': random.choice(mbti_types),
        'recommendations': {
            'hollandRecs': {
                'job_titles': holland_recommendations
            },
            'mbtiRecs': {
                'job_titles': mbti_recommendations
            }
        }
    }
    
    # Add to Firestore
    db.collection('survey_responses').add(response_data)

print(f"Added {num_responses} dummy responses to Firestore")
