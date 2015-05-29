from flask import Blueprint, render_template, abort
from flask import Flask, session, redirect, url_for, escape, request, flash, get_flashed_messages
from jinja2 import TemplateNotFound
import hashlib
import settings
import requests
from models.user import User

auth = Blueprint('auth', __name__, template_folder='application/templates')

@auth.route('/auth/login', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        username = request.form["username"]
        password = request.form["password"]

        user = User.query.filter_by(username=username).first()

        if user == None:
            flash('Invalid username or password')
            return redirect(url_for('auth.index'))
        else:
            hash_pass = hashlib.sha224(password).hexdigest()
            if hash_pass == user.password:
                r = requests.get(settings.API_ENDPOINT + "/token", auth=(username, password))
                data = r.json()
                session['username'] = request.form['username']
                session['token'] = data["token"]
                print session['token']
                return redirect(url_for('data.show'))
            else:
                flash('Invalid username or password')
                return redirect(url_for('auth.index'))
    else:
        try:
            return render_template('auth/login.html', var="login")
        except TemplateNotFound:
            abort(404)

@auth.route('/auth/logout', methods=["GET"])
def logout():
    session.pop('username', None)
    return redirect(url_for('auth.index'))

@auth.route('/auth/about', methods=["GET"])
def about():
    if 'username' not in session:
        return redirect(url_for('auth.index'))
    return render_template('auth/about.html')