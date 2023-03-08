from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data.organization import Organization
from extensions import RESPONSE_CODES, db

import logging

api = Blueprint("organizations", __name__)

@cross_origin()
@api.get("/")
def get_orgs():
    orgs: list[Organization] = Organization.query.all()
    return jsonify(Organization.serialize_list(orgs))

@cross_origin()
@api.get("/<int:id>")
def get_org(id: int):
    org = Organization.query.filter(Organization.id == id).first()
    if org:
        return jsonify(org.serialize())
    return make_response("", RESPONSE_CODES.NOT_FOUND)

@cross_origin()
@api.put("/<int:id>")
def update_org():
    data = request.get_json()
    org = Organization.query.filter(Organization.id == id).first()
    if not org:
        make_response("", RESPONSE_CODES.NOT_FOUND)

    for key, value in data.items():
        setattr(org, key, value)

    try:
        db.session.commit()
    except:
        logging.debug(f"FAILED of org [name: {org.name}, id: {org.id}] with data:\n{data}")
        return make_response("", RESPONSE_CODES.BAD_REQUEST)
    logging.info(f"alteration of org [name: {org.name}, id: {org.id}] with data:\n{data}")
    return make_response("", RESPONSE_CODES.CREATED)

@cross_origin()
@api.post("/")
def post_org():
    data = request.get_json()
    org = Organization()
    for key, value in data.items():
        setattr(org, key, value)
    try:
        db.session.add(org)
        db.session.commit()
    except:
        return make_response("", RESPONSE_CODES.BAD_REQUEST)
    return make_response("", RESPONSE_CODES.CREATED)
