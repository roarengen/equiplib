from flask import Blueprint, request, jsonify, make_response
from data.user import User
from data.db import DatabaseManager, DatabaseTables


dbm = DatabaseManager()
dbm.initalize()

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
    new_user = User(name, password, email)
    new_user.hash_password()
    dbm.insert_into(DatabaseTables.USERS, new_user)
    return make_response("", 201)
    
@api.get("/users")
def get_users():
    users = dbm.query(DatabaseTables.USERS, User)
    serialized_users = []
    for user in users:
        serialized_users.append(user.to_dict())
    return jsonify(serialized_users)


