from blueprints import api
from flask import Flask
from extensions import db, docs, cors, seed_database

app = Flask(__name__)
cors.init_app(app)
app.register_blueprint(api, url_prefix='/api/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADER'] = 'Content-Type'

db.init_app(app)
docs.init_app(app)
app.app_context().push()



#seed_database()

if __name__ == "__main__":
    app.run("localhost", 8888, True)