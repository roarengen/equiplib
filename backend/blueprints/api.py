from flask import Blueprint, request, jsonify, make_response
from sqlalchemy.sql.functions import current_user
from data.user import User
from extensions import db

api = Blueprint("api", __name__)

def register_user(data:dict):
    new_user = User.deserialize(data)
    ...

@api.route("/", methods=["get", "post"])
def register():
    if request.method == "POST":
        register_user(request.get_json())
        return "post"
    return jsonify("hello, world")

@api.post("/users")
def make_new_user():
    roleid = 1
    username = ""
    password = ""
    lastname = ""
    firstname = ""
    email = ""
    organizationid = 1
    data = request.get_json()
    for key in data:
        if key == "username":
            username = data[key]
        if key == "firstname":
            firstname = data[key]
        if key == "lastname":
            lastname = data[key]
        if key == "password":
            password = data[key]
        if key == "email":
            email = data[key]

    new_user = User(roleid=roleid, firstname=firstname, lastname=lastname, username=username, password=password, email=email, organizationid=organizationid)
    if not password or not email or not firstname or not username or not lastname:
        raise ValueError("Not enough information")
    db.session.add(new_user)
    db.session.commit()
    return make_response("", 201)

@api.get("/users/<int:id>")
def get_user(id):
    current_user = User.query.filter(User.id==id).first()
    return jsonify(current_user.serialize())

@api.route("/users")
def get_users():
    users = User.query.all()
    return jsonify(User.serialize_list(users))
