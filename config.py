import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-replace-in-production'
    FIREBASE_CREDENTIALS = os.environ.get('FIREBASE_CREDENTIALS') or 'firebase-credentials.json'
    
    # Flask-Login settings
    SESSION_PROTECTION = 'strong'
    
    # Role definitions
    ROLE_ADMIN = 'admin'
    ROLE_ANALYST = 'analyst'
    ROLE_SURVEYOR = 'surveyor'
    
    # Analytics settings
    ANALYTICS_PER_PAGE = 20
    
    # Survey settings
    MAX_SURVEY_ATTEMPTS = 1
