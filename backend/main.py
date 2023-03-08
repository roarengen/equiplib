from blueprints import api
from enum import Enum, auto
from flask import Flask
from extensions import db, docs, cors, seed_database
from extensions import sys_log_handler, file_handler
import logging

class LaunchArg(Enum):
    TEST = auto()
    DEV = auto()
    PRD = auto()

# intializing app
def create_app(launch_arg : LaunchArg) -> Flask:
    app = Flask("equiplib")
    cors.init_app(app)
    # registering blueprint
    app.register_blueprint(api, url_prefix='/api/')

    # setting configs
    if launch_arg == LaunchArg.DEV or launch_arg == LaunchArg.PRD:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        app.logger.handlers.clear()
        app.logger.addHandler(sys_log_handler)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.DEBUG)
    elif launch_arg == LaunchArg.TEST:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['CORS_HEADER'] = 'Content-Type'


    # initing extensions
    db.init_app(app)
    docs.init_app(app)
    app.app_context().push()

    return app


#seed_database()

if __name__ == "__main__":
    app = create_app(LaunchArg.DEV)
    app.run("localhost", 8888, True)
