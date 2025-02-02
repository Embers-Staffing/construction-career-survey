import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import random
import os
from config import init_firebase

# Initialize Firebase
init_firebase()
db = firestore.client()

def generate_dummy_data(num_entries=10):
    # Lists for random data generation
    first_names = ["John", "Jane", "Michael", "Sarah", "David", "Emma", "James", "Emily", "William", "Olivia"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
    holland_codes = ["R", "I", "A", "S", "E", "C"]
    mbti_types = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"]
    skills = ["hand-tools", "blueprint", "math", "safety", "equipment", "computer"]
    tech_interests = ["drones", "vr-ar", "bim", "ai"]
    career_interests = ["trades", "heavy-machinery", "tech-specialist", "estimator", "project-management"]
    career_goals = ["leadership", "specialist", "business", "innovation"]

    entries = []
    for _ in range(num_entries):
        # Calculate a random date within the last 30 days
        submission_date = datetime.now() - timedelta(days=random.randint(0, 30))
        
        entry = {
            # Personal Profile
            "personalProfile": {
                "firstName": random.choice(first_names),
                "lastName": random.choice(last_names),
                "birthYear": str(random.randint(1970, 2005)),
                "birthMonth": str(random.randint(1, 12)),
                "constructionExperience": str(random.choice([0, 1, 2, 3, 4, 5, 10, 15, 20]))
            },
            
            # Personality & Skills
            "personalityProfile": {
                "mbtiType": random.choice(mbti_types),
                "hollandCode": random.sample(holland_codes, random.randint(1, 3)),
            },
            
            # Skills & Experience
            "skillsProfile": {
                "technicalSkills": random.sample(skills, random.randint(1, len(skills))),
                "certificationLevel": random.choice(["none", "basic", "trade", "advanced", "multiple"])
            },
            
            # Work Preferences
            "workPreferences": {
                "careerInterests": random.sample(career_interests, random.randint(1, 3)),
                "techInterests": random.sample(tech_interests, random.randint(1, len(tech_interests))),
                "environmentPreference": random.choice(["outdoor", "indoor", "mixed"]),
                "travelWillingness": random.choice(["no", "local", "regional", "national", "international"])
            },
            
            # Goals & Development
            "goalsProfile": {
                "careerGoals": random.sample(career_goals, random.randint(1, 3)),
                "salaryTarget": random.choice(["entry", "mid", "senior", "executive"]),
                "advancementPreference": random.choice(["education", "experience", "both"]),
                "mentorshipType": random.choice(["formal", "informal", "peer", "industry"])
            },
            
            # Metadata
            "metadata": {
                "submissionDate": submission_date,
                "lastUpdated": submission_date,
                "status": "completed"
            }
        }
        entries.append(entry)
    
    return entries

def add_entries_to_firestore(entries):
    # Add each entry to Firestore
    for entry in entries:
        # Create a new document with auto-generated ID
        doc_ref = db.collection('survey_responses').document()
        doc_ref.set(entry)
        print(f"Added entry for {entry['personalProfile']['firstName']} {entry['personalProfile']['lastName']}")

if __name__ == "__main__":
    print("Generating dummy survey responses...")
    dummy_entries = generate_dummy_data(10)  # Generate 10 dummy entries
    print("\nAdding entries to Firestore...")
    add_entries_to_firestore(dummy_entries)
    print("\nDummy data generation completed!")
