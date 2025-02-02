from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.urls import url_parse
from app.auth import bp
from firebase_admin import auth
from app.auth.forms import LoginForm, RegistrationForm
from app.models import User

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('survey.index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        try:
            # Verify with Firebase
            user = auth.get_user_by_email(form.email.data)
            # Sign in with email and password
            user_record = auth.verify_password(form.email.data, form.password.data)
            
            # Create User instance
            user_obj = User(
                uid=user.uid,
                email=user.email,
                role=user.custom_claims.get('role', 'surveyor') if user.custom_claims else 'surveyor'
            )
            
            login_user(user_obj, remember=form.remember_me.data)
            
            next_page = request.args.get('next')
            if not next_page or url_parse(next_page).netloc != '':
                next_page = url_for('survey.index')
            
            return redirect(next_page)
            
        except Exception as e:
            flash('Invalid email or password')
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

@bp.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    if current_user.is_authenticated:
        return redirect(url_for('survey.index'))
    
    form = ResetPasswordRequestForm()
    if form.validate_on_submit():
        try:
            # Send password reset email
            link = auth.generate_password_reset_link(form.email.data)
            # Here you would typically send this link via email
            flash('Check your email for password reset instructions')
            return redirect(url_for('auth.login'))
            
        except Exception as e:
            flash('Error sending reset instructions. Please try again.')
    
    return render_template('auth/reset_password_request.html', title='Reset Password', form=form)
