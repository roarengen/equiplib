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
    new_user = User()
    new_user.password = password
    new_user.email = email
    new_user.name = name
    new_user.hash_password()
    dbm.insert_into(DatabaseTables.USERS, new_user)
    return make_response("", 201)
    
@api.get("/users/<int:id>")
def get_user(id):
    users = dbm.query(DatabaseTables.USERS, User)
    serialized_users = []
    
    for user in users:
        serialized_users.append(user.serialize())
        
    current_user = None  
    for user in serialized_users:
        if user['id'] == id:
            current_user = user
    
    if current_user == None:
        return make_response("Index out of range", 400)
    return jsonify(current_user)

@api.route("/users")
def get_users():
    users = dbm.query(DatabaseTables.USERS, User)
    serialized_users = []
    
    for user in users:
        serialized_users.append(user.to_dict())
    return jsonify(serialized_users)