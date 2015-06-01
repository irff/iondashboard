from flask import Flask
from database import db_session
import config

"""import all controller from application.controllers"""
from controllers.auth import auth
from controllers.data import data
"""import more controller"""

app = Flask(__name__)
app.secret_key = config.SECRET_KEY

"""register each controller as blueprint"""
app.register_blueprint(data)
app.register_blueprint(auth)
"""register more controller"""

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.debug = True
    app.run(port=config.PORT, host='0.0.0.0')