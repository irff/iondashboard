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

    r = requests.get(settings.API_ENDPOINT + '/listmedia', auth=(session['token'], 'unused'))

    if r.status_code != 200:
        return redirect(url_for('auth.logout'))

    url = request.args.get("url")
    file_name = datetime.now().strftime("%Y-%m-%d") + "_" + hashlib.sha224(url).hexdigest() + ".png"
    file_name = "snapshot/" + file_name

    if os.path.exists(file_name) == False:
        print "call snapshot"
        output = check_output(["python",settings.SNAPSHOT_SCRIPT,url,file_name])
        print output

    return send_file(file_name, mimetype='image/png')
