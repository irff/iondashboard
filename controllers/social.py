from flask import Blueprint, render_template, abort
from flask import  session, redirect, url_for, request, send_file
from jinja2 import TemplateNotFound
import settings
import requests
import io

social = Blueprint('social', __name__, template_folder='application/templates')

@social.route('/social/', defaults={'data': 'index'})
def show(data):
    try:
        return "hello world"
    except TemplateNotFound:
        abort(404)