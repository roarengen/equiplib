from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data import Equipment
from extensions import RESPONSE_CODES, db, logger

api = Blueprint("equipment", __name__)

@cross_origin()
@api.get("/")
def get_rents():
    return make_response("illegal endpoint", RESPONSE_CODES.UNAUTHORIZED)

@cross_origin()
@api.get("/<int:id>")
def get_equips(id: int):
    equip: Equipment = Equipment.query.filter(Equipment.id == id).first()
    if not equip:
        return make_response("rent not found", RESPONSE_CODES.NOT_FOUND)
    return jsonify(equip.serialize())

@cross_origin()
@api.post("/")
def post_equips():
    data = request.get_json()
    equip = Equipment()
    for key, val in data.items():
        setattr(equip, key, val)

    try:
        db.session.add(equip)
        db.session.commit()
    except:
        return make_response(f"invalid data: {data}", RESPONSE_CODES.BAD_REQUEST)
    return make_response("", RESPONSE_CODES.CREATED)


@cross_origin()
@api.get("/by_org/<int:orgid>")
def get_by_org_id(orgid:int):
    equips: list[Equipment] = Equipment.query.filter(Equipment.organizationid == orgid).all()
    return jsonify(Equipment.serialize_list(equips))
