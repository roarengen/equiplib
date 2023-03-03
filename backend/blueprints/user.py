from flask import Blueprint, request, jsonify, make_response
from flask_apispec import use_kwargs, marshal_with
from flask_cors import cross_origin
from webargs import fields
from sqlalchemy.sql.functions import current_user
import sqlalchemy
from data.user import User
from extensions import db, docs, RESPONSE_CODES, encrypt

api = Blueprint("users", __name__)


@use_kwargs({
    'roleid' : fields.Int(),
    'firstname' : fields.Str(),
    'lastname' : fields.Str(),
    'username' : fields.Str(),
    'password' : fields.Str(),
    'email' : fields.Str(),
    'organizationid' : fields.Str(),
    })
@marshal_with(User)
@api.post("/")
@cross_origin()
def post_user():
    data = request.get_json()
    try:
        new_user = User(
            roleid=data['roleid'],
            firstname=data['firstname'],
            lastname=data['lastname'],
            username=data['username'],
            password=encrypt(data['password']),
            email=data['email'],
            organizationid=data['organizationid'])
    except KeyError:
        return make_response("invalid request", RESPONSE_CODES.BAD_REQUEST)
    try:
        db.session.add(new_user)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return make_response("user with that username already exists", RESPONSE_CODES.BAD_REQUEST)

    return make_response("", RESPONSE_CODES.SUCCESS)

@api.get("/<int:id>")
@cross_origin()
def get_user(id):
    user = User.query.filter(User.id==id).first()
    if user:
        return jsonify(user.serialize())
    return make_response("",RESPONSE_CODES.NOT_FOUND)

@api.put("/<int:id>")
@cross_origin()
def update_user(id):
    RESPONSE_CODE = RESPONSE_CODES.NOT_FOUND
    data = request.get_json()
    user = User.query.filter(User.id==id).first()
    if current_user:
        for key, value in data.items():
            setattr(user, key, value)
        db.session.update(user)
        db.session.commit()
        RESPONSE_CODE = RESPONSE_CODES.CREATED
    return make_response("",RESPONSE_CODE)

@api.delete("/<int:id>")
@cross_origin()
def delete_user(id):
    RESPONSE_CODE = RESPONSE_CODES.NOT_FOUND
    current_user = User.query.filter(User.id==id).first()
    if current_user:
        db.session.delete(current_user)
        db.session.commit()
        RESPONSE_CODE = RESPONSE_CODES.CREATED
    return make_response("",RESPONSE_CODE)

@api.get("/")
@cross_origin()
def get_users():
    users = User.query.all()
    return jsonify(User.serialize_list(users))

@api.post("/login")
@cross_origin()
def login_user():
    data = request.get_json()
    try:
        username, password = data['username'], data['password']
        user = User.query.filter(User.username == username).first()
        if user:
            valid = user.verify_password(password)
            if valid:
                return jsonify(user.serialize())
            else:
                return make_response("", RESPONSE_CODES.UNAUTHORIZED)
    except:
        make_response("", RESPONSE_CODES.BAD_REQUEST)
    return make_response("", RESPONSE_CODES.UNAUTHORIZED)


@api.post("/qrlogin")
@cross_origin()
def login_user_qr():
    data = request.get_json()
    try:
        qrstring, password = data['username'], data['password']
        user = User.query.filter(User.id == qrstring).first()
        if user:
            valid = user.verify_password(password)
            if valid:
                return jsonify(user.serialize())
            else:
                return make_response("", RESPONSE_CODES.UNAUTHORIZED)
    except:
        make_response("", RESPONSE_CODES.BAD_REQUEST)
    return make_response("", RESPONSE_CODES.UNAUTHORIZED)

@api.post("/by_org/<int:orgid>")
@cross_origin()
def get_users_by_org(orgid:int):
    users = User.query.filter(User.organizationid == orgid).all()
    if users:
        return jsonify(User.serialize_list(users))
    return make_response("", RESPONSE_CODES.NOT_FOUND)

docs.register(post_user, blueprint="api.users")
