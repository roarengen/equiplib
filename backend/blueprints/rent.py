from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data import Rent, User
from extensions import RESPONSE_CODES, db

api = Blueprint("rents", __name__)

@cross_origin()
@api.get("/")
def get_rents():
    return make_response("illegal endpoint", RESPONSE_CODES.UNAUTHORIZED)

@cross_origin()
@api.get("/<int:id>")
def get_rent(id: int):
    rent: Rent = Rent.query.filter(Rent.id == id).first()
    if not rent:
        return make_response("rent not found", RESPONSE_CODES.NOT_FOUND)
    return jsonify(rent.serialize())

@cross_origin()
@api.get("/by_org/<int:orgid>")
def get_rent_by_orgid(orgid: int):
    users: list[User] = User.query.filter(User.organizationid==orgid).all()
    if not users:
        print("no users found in org")
        return make_response("no users with that orgid", RESPONSE_CODES.NOT_FOUND)

    userids = [user.id for user in users]
    rents: list[Rent] = Rent.query.filter(Rent.userid.in_((userids))).all()
    if not rents:
        print("no rents found in org")
        return make_response("no rents for this orgid", RESPONSE_CODES.NOT_FOUND)

    return jsonify(Rent.serialize_list(rents))

@cross_origin()
@api.get("/by_user/<int:userid>")
def get_rent_by_userid(userid: int):
    rents: list[Rent] = Rent.query.filter(Rent.userid == userid).all()
    return jsonify(Rent.serialize_list(rents))

