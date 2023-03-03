from flask import Blueprint, request, jsonify, make_response
from sqlalchemy.sql.functions import current_user
import sqlalchemy
from data.user import User
from extensions import db

api = Blueprint("api", __name__)

@api.post("/users")
def make_new_user():
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

@api.get("/users/<int:id>")
def get_user(id):
    ...

@api.put("/users/<int:id>")
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

@api.delete("/users/<int:id>")
def delete_user(id):
    RESPONSE_CODE = 404
    current_user = User.query.filter(User.id==id).first()
    if current_user:
        db.session.delete(current_user)
        db.session.commit()
        RESPONSE_CODE = 204
    return make_response("",RESPONSE_CODE)

@api.route("/users")
def get_users():
    users = User.query.all()
    return jsonify(User.serialize_list(users))
