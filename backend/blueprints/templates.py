from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from data import Template
from extensions import RESPONSE_CODES, db, logger

api = Blueprint("template", __name__)


@cross_origin()
@api.get("/")
def get_temps():
    temps: list[Template] = Template.query.all()
    return jsonify(Template.serialize_list(temps))


@cross_origin()
@api.get("/<int:id>")
def get_temp(id: int):
    temp = Template.query.filter(Template.id == id).first()
    if temp:
        return jsonify(temp.serialize())
    return make_response("", RESPONSE_CODES.NOT_FOUND)


@api.put("/<int:id>")
@cross_origin()
def put_template(id: int):
    data = request.get_json()
    temp = Template.query.filter_by(id=id).first()
    if not temp:
        make_response("", RESPONSE_CODES.NOT_FOUND)

    for key, val in data.items():
        setattr(temp, key, val)

    try:
        db.session.add(temp)
        db.session.commit()
    except:
        logger.debug(f"failed modification template with data: {data}")
        return make_response(f"failed modification of template with data: {data}", RESPONSE_CODES.BAD_REQUEST)

    return make_response("", RESPONSE_CODES.SUCCESS)


@api.post("/")
@cross_origin()
def post_template():
    data = request.get_json()
    new_temp = Template()

    for key, val in data.items():
        setattr(new_temp, key, val)

    try:
        db.session.add(new_temp)
        db.session.commit()
    except:
        logger.debug(f"failed creation of template with data: {data}")
        return make_response(f"failed creation of template with data: {data}", RESPONSE_CODES.BAD_REQUEST)

    return make_response("", RESPONSE_CODES.SUCCESS)


@api.get("/<int:id>/disable")
@cross_origin()
def disable(id: int):
    temp = Template.query.filter(id == id).first()
    if not temp:
        return make_response(f"template not found with id {id}", RESPONSE_CODES.NOT_FOUND)
    temp.active = False
    db.session.commit()
    return make_response(f"disabled template with id {id}", RESPONSE_CODES.SUCCESS)
