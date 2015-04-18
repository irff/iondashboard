from flask import Flask
import config

"""import all controller from application.controllers"""
from controllers.page import page
from controllers.data import data
"""import more controller"""

app = Flask(__name__)
app.secret_key = config.SECRET_KEY

"""register each controller as blueprint"""
app.register_blueprint(page)
app.register_blueprint(data)
"""register more controller"""

if __name__ == '__main__':
    app.debug = True
    app.run(port=config.PORT)