from flask import Blueprint
from blueprints.role import api as roleapi
from blueprints.user import api as userapi
from blueprints.organization import api as orgapi
api = Blueprint("api", __name__)
api.register_blueprint(roleapi, url_prefix='/roles/')
api.register_blueprint(userapi, url_prefix='/users/')
api.register_blueprint(orgapi, url_prefix='/orgs/')