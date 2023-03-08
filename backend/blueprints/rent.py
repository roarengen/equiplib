from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data import Rent, User
from extensions import RESPONSE_CODES, db

api = Blueprint("rents", __name__)

@cross_origin()
@api.get("/by_org/<int:orgid>")
def get_rent_by_orgid(orgid: int):
    users: list[User] = User.query.filter(User.organizationid==orgid).all()
    if not users:
        make_response("no users with that orgid", RESPONSE_CODES.NOT_FOUND)

    rents: list[Rent] = Rent.query.filter(Rent.userid in [user.id for user in users]).all()
    if not rents:
        make_response("no rents for this orgid", RESPONSE_CODES.NOT_FOUND)

    return jsonify(Rent.serialize_list(rents))

@cross_origin()
@api.get("/by_user/<int:userid>")
def get_rent_by_userid(userid: int):
    rents: list[Rent] = Rent.query.filter(Rent.userid == userid).all()
    return jsonify(Rent.serialize_list(rents))

