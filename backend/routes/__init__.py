from fastapi import APIRouter
#from blueprints.role import api as roleapi
from routes.user import api as userapi
from routes.organization import api as orgapi
#from routes.location import api as locationapi
#from routes.rent import api as rentapi
#from routes.equipment import api as equipmentapi
#from routes.templates import api as templateapi

api = APIRouter(prefix="/api")

#api.register_blueprint(roleapi, url_prefix='/roles/')
api.include_router(userapi)
api.include_router(orgapi)
#api.register_blueprint(rentapi, url_prefix='/rents/')
#api.register_blueprint(orgapi, url_prefix='/orgs/')
#api.register_blueprint(locationapi, url_prefix='/locations/')
#api.register_blueprint(equipmentapi, url_prefix='/equips/')
#api.register_blueprint(templateapi, url_prefix='/temps/')
