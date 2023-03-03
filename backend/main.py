from blueprints import api
from flask import Flask
from extensions import db, seed_database


app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.app_context().push()



#seed_database()

if __name__ == "__main__":
    app.run("localhost", 8888, True)