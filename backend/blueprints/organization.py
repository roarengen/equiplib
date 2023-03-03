from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data.organization import Organization
from extensions import RESPONSE_CODES, db

api = Blueprint("organizations", __name__)

@cross_origin()
@api.get("/")
def get_orgs():
    orgs = Organization.query.all()
    return jsonify(Organization.serialize_list(orgs))

@cross_origin()
@api.get("/<int:id>")
def get_org(id: int):
    org = Organization.query.filter(Organization.id == id).first()
    if org:
        return jsonify(org.serialize())
    return make_response("", RESPONSE_CODES.NOT_FOUND)

@cross_origin()
@api.post("/")
def post_org():
    data = request.json()
    org = Organization()
    for key, value in data.items():
        setattr(org, key, value)
    try:
        db.session.add(org)
        db.session.commit()
    except:
        return make_response("", RESPONSE_CODES.BAD_REQUEST)
    return make_response("", RESPONSE_CODES.CREATED)
