from data.role import Role
from flask import jsonify, Blueprint, make_response
from flask_cors import cross_origin
from extensions import RESPONSE_CODES

api = Blueprint("roles", __name__)

@cross_origin()
@api.get("/")
def get_roles():
    roles = Role.query.all()
    return jsonify(Role.serialize_list(roles))

@cross_origin()
@api.get("/<int:id>")
def get_role(id):
    roles = Role.query.filter(Role.id==id).first()
    if not roles:
        return make_response("", RESPONSE_CODES.BAD_REQUEST)
    return jsonify(roles.serialize())
