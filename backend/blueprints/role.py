from data.role import Role
from flask import jsonify, Blueprint, make_response

api = Blueprint("roles", __name__)

@api.get("/")
def get_roles():
    roles = Role.query.all()
    return jsonify(Role.serialize_list(roles))

@api.get("/<int:id>")
def get_role(id):
    roles = Role.query.filter(Role.id==id).first()
    if not roles:
        return make_response("", 404)
    return jsonify(roles.serialize())
