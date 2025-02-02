from flask import render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from urllib.parse import urlparse
from app.auth import bp
from firebase_admin import auth
from app.auth.forms import LoginForm, RegistrationForm, ResetPasswordRequestForm
from app.models import User

FIREBASE_WEB_API_KEY = 'AIzaSyBhWbAY4xKtWxlZALEQQDXHxpJwZHKOKhI'

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('survey.index'))
    
    form = LoginForm()
    
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            
            try:
                # Sign in with Firebase Admin SDK
                user = auth.get_user_by_email(data.get('email'))
                
                # Create User instance
                user_obj = User(
                    uid=user.uid,
                    email=user.email,
                    role=user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
                )
                
                login_user(user_obj, remember=data.get('remember', False))
                
                next_page = request.args.get('next')
                if not next_page or urlparse(next_page).netloc != '':
                    next_page = url_for('survey.index')
                
                return jsonify({'redirect': next_page})
                
            except Exception as e:
                return jsonify({'error': str(e)}), 401
    
    if form.validate_on_submit():
        try:
            # Get the email and password from the form
            email = form.email.data
            password = form.password.data
            
            # Sign in with Firebase Admin SDK
            user = auth.get_user_by_email(email)
            
            # Verify the password
            if not auth.verify_password(user.uid, password):
                flash('Invalid email or password')
                return redirect(url_for('auth.login'))
            
            # Create User instance
            user_obj = User(
                uid=user.uid,
                email=user.email,
                role=user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
            )
            
            login_user(user_obj, remember=form.remember_me.data)
            
            next_page = request.args.get('next')
            if not next_page or urlparse(next_page).netloc != '':
                next_page = url_for('survey.index')
            
            return redirect(next_page)
            
        except Exception as e:
            flash('Authentication failed: ' + str(e))
            return redirect(url_for('auth.login'))
    
    return render_template('auth/login.html', title='Sign In', form=form)

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('survey.index'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        try:
            # Create user in Firebase
            user = auth.create_user(
                email=form.email.data,
                password=form.password.data
            )
            
            # Set default role
            auth.set_custom_user_claims(user.uid, {'role': 'surveyor'})
            
            flash('Congratulations, you are now registered!')
            return redirect(url_for('auth.login'))
            
        except Exception as e:
            flash('Registration failed. Please try again.')
            return redirect(url_for('auth.register'))
    
    return render_template('auth/register.html', title='Register', form=form)

@bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if current_user.is_authenticated:
        return redirect(url_for('survey.index'))
    
    form = ResetPasswordRequestForm()
    if form.validate_on_submit():
        try:
            # Send password reset email using Firebase
            auth.generate_password_reset_link(form.email.data)
            flash('Check your email for instructions to reset your password')
            return redirect(url_for('auth.login'))
        except Exception as e:
            flash('Error sending password reset email: ' + str(e))
    
    return render_template('auth/reset_password_request.html',
                         title='Reset Password', form=form)

@bp.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    return redirect(url_for('auth.reset_password_request'))
