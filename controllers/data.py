from flask import Blueprint, render_template, abort
from flask import Flask, session, redirect, url_for, escape, request, flash, get_flashed_messages
from jinja2 import TemplateNotFound
from models import *

data = Blueprint('data', __name__, template_folder='application/templates')

@data.route('/index')
@data.route('/')
def index():
    try:
        return render_template('data/index.html')
    except TemplateNotFound:
        abort(404)

@data.route('/data', defaults={'data': 'index'})
@data.route('/data/<data>')
def show(data):
    try:
        return render_template('data/%s.html' % data, var=data)
    except TemplateNotFound:
        abort(404)
