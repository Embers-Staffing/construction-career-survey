from flask_login import UserMixin
from app import login
from firebase_admin import auth

class User(UserMixin):
    def __init__(self, uid, email, role='surveyor'):
        self.id = uid  # Flask-Login uses id
        self.uid = uid
        self.email = email
        self.role = role
    
    def get_id(self):
        return self.uid

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def is_admin(self):
        return self.role == 'admin'
    
    def is_analyst(self):
        return self.role in ['admin', 'analyst']
    
    def can_view_analytics(self):
        # Temporarily allow all users to view analytics for testing
        return True
    
    @staticmethod
    def get_by_email(email):
        try:
            user = auth.get_user_by_email(email)
            role = user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
            return User(user.uid, user.email, role)
        except:
            return None

@login.user_loader
def load_user(user_id):
    try:
        user = auth.get_user(user_id)
        return User(
            uid=user.uid,
            email=user.email,
            role=user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
        )
    except:
        return None
