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
    password = ""
    email = ""
    name = ""
    data = request.get_json()
    for key in data:
        if key == "name":
            name = data[key]
        if key == "password":
            password = data[key]
        if key == "email":
            email = data[key]

    if not password or not email or not name:
        raise ValueError("Not enough information")
    return make_response("", 201)

@api.get("/users/<int:id>")
def get_user(id):
    current_user = User.query.filter(id=id)
    return jsonify(current_user)

@api.route("/users")
def get_users():
    users = User.query.all()
    return jsonify(User.serialize_list(users))
