from flask import render_template, flash, redirect, url_for, request
from flask_login import login_required, current_user
from app.analytics import bp

@bp.route('/')
@login_required
def index():
    return render_template('analytics/index.html', title='Analytics Dashboard')
