from flask import Blueprint
from blueprints.role import api as roleapi
from blueprints.user import api as userapi
api = Blueprint("api", __name__)
api.register_blueprint(roleapi, url_prefix='/roles/')
api.register_blueprint(userapi, url_prefix='/users/')