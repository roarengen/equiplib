from flask import Blueprint, request, jsonify
api = Blueprint('api', "equilib")


@api.route("/")
def register():
    if request.method == "post":
        return "post"
    return jsonify("hello, world")
