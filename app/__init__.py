import os
from flask import Flask
from flask_login import LoginManager
from config import Config
import firebase_admin
from firebase_admin import credentials

login = LoginManager()
login.login_view = 'auth.login'
login.login_message = 'Please log in to access this page.'

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Firebase Admin
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": app.config['FIREBASE_PROJECT_ID'],
        "private_key_id": app.config['FIREBASE_PRIVATE_KEY_ID'],
        "private_key": app.config['FIREBASE_PRIVATE_KEY'],
        "client_email": app.config['FIREBASE_CLIENT_EMAIL'],
        "client_id": app.config['FIREBASE_CLIENT_ID'],
        "auth_uri": app.config['FIREBASE_AUTH_URI'],
        "token_uri": app.config['FIREBASE_TOKEN_URI'],
        "auth_provider_x509_cert_url": app.config['FIREBASE_AUTH_PROVIDER_CERT_URL'],
        "client_x509_cert_url": app.config['FIREBASE_CLIENT_CERT_URL']
    })
    
    try:
        firebase_admin.initialize_app(cred)
    except ValueError:
        # App already initialized
        pass

    login.init_app(app)

    # Register blueprints
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    from app.survey import bp as survey_bp
    app.register_blueprint(survey_bp)
    
    from app.analytics import bp as analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/analytics')
    
    return app
