from flask import Blueprint
from blueprints.role import api as roleapi
from blueprints.user import api as userapi
from blueprints.organization import api as orgapi
from blueprints.location import api as locationapi
from blueprints.rent import api as rentapi
from blueprints.equipment import api as equipmentapi
api = Blueprint("api", __name__)
api.register_blueprint(roleapi, url_prefix='/roles/')
api.register_blueprint(userapi, url_prefix='/users/')
api.register_blueprint(rentapi, url_prefix='/rents/')
api.register_blueprint(orgapi, url_prefix='/orgs/')
api.register_blueprint(locationapi, url_prefix='/locations/')
api.register_blueprint(equipmentapi, url_prefix='/equips/')
