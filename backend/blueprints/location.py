from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data import Location, Organization
from extensions import RESPONSE_CODES, db, logger

api = Blueprint("location", __name__)


@cross_origin()
@api.get("/")
def get_locs():
    locs : list[Location] = Location.query.all()
    return jsonify(Location.serialize_list(locs))

@cross_origin()
@api.get("/<int:id>")
def get_loc(id: int):
    loc = Location.query.filter(Location.id == id).first()
    if loc:
        return jsonify(loc.serialize())
    return make_response("", RESPONSE_CODES.NOT_FOUND)

@cross_origin()
@api.get("/by_org/<int:orgid>")
def get_loc_by_org_id(orgid: int):
    locs = Location.query.filter(Location.organizationid == orgid).all()
    if locs:
        return jsonify(locs.serialize())
    return make_response("", RESPONSE_CODES.NOT_FOUND)

@api.post("/")
@cross_origin()
def post_location():
    data = request.get_json()
    try:
        new_loc = Location(
            organizationid = data['organizationid'],
            name = data['name'],
            active = True
        )
    except KeyError:
        logger.info(f"failed location creation request with data: {data}")
        return make_response("invalid request", RESPONSE_CODES.BAD_REQUEST)

    db.session.add(new_loc)
    db.session.commit()

    return make_response("", RESPONSE_CODES.SUCCESS)

@api.get("/<int:id>/disable")
@cross_origin()
def disable(id: int):
    loc = Location.query.filter(id==id).first()
    if not loc:
        return make_response(f"location not found with id {id}", RESPONSE_CODES.NOT_FOUND)
    loc.active = False
    db.session.commit()
    return make_response(f"disabled location with id {id}", RESPONSE_CODES.SUCCESS)

