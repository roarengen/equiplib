from flask import Blueprint, request, jsonify
from data.user import User
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
