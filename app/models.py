from flask_login import UserMixin
from app import login_manager
from firebase_admin import auth

class User(UserMixin):
    def __init__(self, uid, email, role='surveyor'):
        self.id = uid
        self.email = email
        self.role = role
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_analyst(self):
        return self.role in ['admin', 'analyst']
    
    def can_view_analytics(self):
        return self.is_analyst()
    
    @staticmethod
    def get_by_email(email):
        try:
            user = auth.get_user_by_email(email)
            role = user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
            return User(user.uid, user.email, role)
        except:
            return None

@login_manager.user_loader
def load_user(user_id):
    try:
        user = auth.get_user(user_id)
        role = user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
        return User(user.uid, user.email, role)
    except:
        return None
