import os
import json
from firebase_admin import credentials, initialize_app

# Firebase configuration
def init_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if app is already initialized
        initialize_app()
    except ValueError:
        # Look for credentials file
        creds_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')
        if not os.path.exists(creds_path):
            raise FileNotFoundError(
                "Firebase credentials not found. Please place your service account key "
                "in 'analytics/firebase-credentials.json'"
            )
        
        # Initialize with credentials if not already done
        cred = credentials.Certificate(creds_path)
        initialize_app(cred)
