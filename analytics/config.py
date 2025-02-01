import os
import json
import logging
from firebase_admin import credentials, initialize_app

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Firebase configuration
def init_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if app is already initialized
        logger.debug("Attempting to initialize Firebase...")
        initialize_app()
        logger.debug("Firebase already initialized")
    except ValueError:
        # Look for credentials file
        creds_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')
        logger.debug(f"Looking for credentials at: {creds_path}")
        
        if not os.path.exists(creds_path):
            logger.error(f"Credentials file not found at: {creds_path}")
            raise FileNotFoundError(
                "Firebase credentials not found. Please place your service account key "
                "in 'analytics/firebase-credentials.json'"
            )
        
        try:
            # Initialize with credentials if not already done
            logger.debug("Loading credentials from file...")
            cred = credentials.Certificate(creds_path)
            initialize_app(cred)
            logger.debug("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing Firebase: {str(e)}")
            raise
