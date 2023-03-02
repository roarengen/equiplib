from blueprints.api import api
from flask import Flask
app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api/')

if __name__ == "__main__":
    app.run("localhost", 8888, True)
