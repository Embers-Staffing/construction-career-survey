from flask import Flask
from flask_login import LoginManager
from config import Config

login_manager = LoginManager()
login_manager.login_view = 'auth.login'

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    login_manager.init_app(app)
    
    # Register blueprints
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    from app.survey import bp as survey_bp
    app.register_blueprint(survey_bp, url_prefix='/survey')
    
    from app.analytics import bp as analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/analytics')
    
    return app
