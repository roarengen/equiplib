from blueprints import api
from flask import Flask
from extensions import db, docs, cors, seed_database
from extensions import sys_log_handler, file_handler
import logging

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
app.logger.handlers.clear()
app.logger.addHandler(sys_log_handler)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.DEBUG)

# initing extensions
db.init_app(app)
docs.init_app(app)
app.app_context().push()


#seed_database()

if __name__ == "__main__":
    app.run("localhost", 8888, True)
