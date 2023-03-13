from fastapi import APIRouter
#from blueprints.role import api as roleapi
from routes.user import api as userapi
from routes.organization import api as orgapi
#from routes.location import api as locationapi
#from routes.rent import api as rentapi
from routes.equipment import api as equipmentapi
#from routes.templates import api as templateapi

api = APIRouter(prefix="/api")

api.include_router(userapi)
api.include_router(orgapi)
api.include_router(equipmentapi)
