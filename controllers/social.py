from flask import Blueprint, render_template, abort
from flask import  session, redirect, url_for, request, send_file
from jinja2 import TemplateNotFound
import settings
import requests
import io

# COMMENT BY KANDITO
# from config import *
# import database.dbkeyword as dbk
# import database.dbresult as dbr
#
# import json, urllib
# import analytics.tweet as tweeta


social = Blueprint('social', __name__, template_folder='application/templates')

@social.route("/social")
def home():
    return render_template('social/index.html')

"""
@social.route("/analyze/<keyword>")
def analyze(keyword):
  return render_template('analyze.html', keyword = keyword, encoded_keyword = urllib.quote(keyword, safe='~()*!.\''))



# API
@social.route("/api/stream", methods=['POST'])
def apistream():
  keyword = request.json['keyword']
  status = request.json['status']
  if any([x.keyword == keyword and x.processing for x in dbk.get()]):
    return "%s is processing" % keyword
  return json.dumps( dbk.set(request.json) )

@social.route("/api/summary", methods=['GET'])
def summary():
  keywords = [x for x in dbk.get() if x.status != 'removed']
  keywords.sort(lambda x, y: cmp(x.status, y.status))
  return json.dumps( map(tweeta.getinfo, keywords) )

@social.route("/api/analyze/freq/<keyword>", methods=['GET'])
def apianalyze(keyword):
  return json.dumps( tweeta.get_tweet_freq(keyword) )

@social.route("/api/analyze/topmention/<keyword>", methods=['GET'])
def topmention(keyword):
  return json.dumps( tweeta.get_top_mention(keyword) )

@social.route("/api/analyze/topposting/<keyword>", methods=['GET'])
def topposting(keyword):
  return json.dumps( tweeta.get_top_posting(keyword) )

@social.route("/api/analyze/topretweet/<keyword>", methods=['GET'])
def topretweet(keyword):
  return json.dumps( tweeta.get_top_retweet(keyword) )

"""