from flask import Blueprint, render_template, abort
from flask import  session, redirect, url_for, request, send_file
from jinja2 import TemplateNotFound
import settings
import requests
import hashlib
from datetime import datetime
from subprocess import check_output
import os.path

data = Blueprint('data', __name__, template_folder='application/templates')

@data.route('/index/', methods=['GET'])
@data.route('/', methods=['GET'])
def index():
    return redirect(url_for('data.show'))

@data.route('/data/', defaults={'data': 'index'})
@data.route('/data/<data>')
def show(data):
    if 'username' not in session:
        return redirect(url_for('auth.index'))

    r = requests.get(settings.API_ENDPOINT + '/listmedia', auth=(session['token'], 'unused'))

    if r.status_code != 200:
        return redirect(url_for('auth.logout'))

    try:
        return render_template('data/%s.html' % data, var=data)
    except TemplateNotFound:
        abort(404)

@data.route('/snapshot')
def snapshot():
    if 'username' not in session:
        return redirect(url_for('auth.index'))

    url = request.args.get("url")
    r = requests.get('http://128.199.168.81:3000/?url=' + url)
    return send_file(r.raw, mimetype='image/png')
