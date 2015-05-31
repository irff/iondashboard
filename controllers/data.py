from flask import Blueprint, render_template, abort
from flask import Flask, session, redirect, url_for, escape, request, flash, get_flashed_messages
from jinja2 import TemplateNotFound

data = Blueprint('data', __name__, template_folder='application/templates')

@data.route('/index/', methods=['POST'])
@data.route('/', methods=['POST'])
def index():
    reqq = request.form
    print(request)
    try:
        return render_template('data/index.html' % data, var="index",req=reqq)
    except TemplateNotFound:
        abort(404)

@data.route('/data/', defaults={'data': 'index'})
@data.route('/data/<data>')
def show(data):
    # if 'username' not in session:
    #     return redirect(url_for('auth.index'))

    try:
        return render_template('data/%s.html' % data, var=data)
    except TemplateNotFound:
        abort(404)
