from flask import Blueprint, render_template, abort
from flask import  session, redirect, url_for, request, send_file
from jinja2 import TemplateNotFound
import settings
import requests
import io

dashboard = Blueprint('dashboard', __name__, template_folder='application/templates')

@dashboard.route('/dashboard', methods=['GET'])
def show():
    if 'username' not in session:
        return redirect(url_for('auth.index'))

    r = requests.get(settings.API_ENDPOINT + '/listmedia', auth=(session['token'], 'unused'))

    if r.status_code != 200:
        return redirect(url_for('auth.logout'))

    try:
        return render_template('dashboard/index.html')
    except TemplateNotFound:
        abort(404)
