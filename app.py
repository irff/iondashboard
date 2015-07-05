from flask import Flask
from database import db_session
import settings

from tornado.wsgi import WSGIContainer
from tornado.web import Application, FallbackHandler
from tornado.ioloop import IOLoop
from tornado import autoreload


"""import all controller from application.controllers"""
from controllers.auth import auth
from controllers.data import data
from controllers.social import social
from controllers.dashboard import dashboard
"""import more controller"""

app = Flask(__name__)
app.secret_key = settings.SECRET_KEY

"""register each controller as blueprint"""
app.register_blueprint(data)
app.register_blueprint(auth)
app.register_blueprint(social)
app.register_blueprint(dashboard)
"""register more controller"""

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

# if __name__ == '__main__':
#     app.debug = True
#     app.run(port=settings.PORT, host='0.0.0.0')

if __name__ == "__main__":
    container = WSGIContainer(app)
    server = Application([
        (r'.*', FallbackHandler, dict(fallback=container))
    ])
    server.listen(settings.PORT, address=settings.IP)
    ioloop = IOLoop.instance()
    autoreload.start(ioloop)
    ioloop.start()