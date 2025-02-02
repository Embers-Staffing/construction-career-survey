from flask import render_template, flash, redirect, url_for, request
from flask_login import login_required, current_user
from app.survey import bp

@bp.route('/')
@bp.route('/index')
@login_required
def index():
    return render_template('survey/index.html', title='Survey Dashboard')

@bp.route('/take_survey', methods=['GET', 'POST'])
@login_required
def take_survey():
    return render_template('survey/take_survey.html', title='Take Survey')
