from flask import Blueprint, request, jsonify, make_response
from flask_apispec import use_kwargs, marshal_with
from webargs import fields
from sqlalchemy.sql.functions import current_user
import sqlalchemy
from data.user import User
from extensions import db, docs

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
def post_user():
    data = request.get_json()
    try:
        new_user = User(
            roleid=data['roleid'], 
            firstname=data['firstname'], 
            lastname=data['lastname'], 
            username=data['username'], 
            password=data['password'], 
            email=data['email'], 
            organizationid=data['organizationid'])
    except KeyError:
        return make_response("invalid request", 400)
    try:
        db.session.add(new_user)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return make_response("user with that username already exists", 400)

    return make_response("", 201)

@api.get("/<int:id>")
def get_user(id):
    user = User.query.filter(User.id==id).first()
    if user:
        return jsonify(user.serialize())
    return make_response("",404)

@api.put("/<int:id>")
def update_user(id):
    RESPONSE_CODE = 404
    data = request.json()
    user = User.query.filter(User.id==id).first()
    if current_user:
        for key, value in data.items():
            setattr(user, key, value)
        db.session.update(user)
        db.session.commit()
        RESPONSE_CODE = 201
    return make_response("",RESPONSE_CODE)

@api.delete("/<int:id>")
def delete_user(id):
    RESPONSE_CODE = 404
    current_user = User.query.filter(User.id==id).first()
    if current_user:
        db.session.delete(current_user)
        db.session.commit()
        RESPONSE_CODE = 204
    return make_response("",RESPONSE_CODE)

@api.get("/")
def get_users():
    users = User.query.all()
    return jsonify(User.serialize_list(users))


docs.register(post_user, blueprint="api.users")