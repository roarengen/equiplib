from blueprints import api
from flask import Flask
from extensions import db, docs, cors, seed_database
import logging
import sys

# intializing app
app = Flask("equiplib")
cors.init_app(app)
# registering blueprint
app.register_blueprint(api, url_prefix='/api/')

# setting configs
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADER'] = 'Content-Type'

# logging
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
app.logger.handlers.clear()
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)

# initing extensions
db.init_app(app)
docs.init_app(app)
app.app_context().push()


#seed_database()

if __name__ == "__main__":
    app.run("localhost", 8888, True)
