from blueprints.api import api
from flask import Flask
from extensions import db

from data.user import User
from data.role import Role
from data.organization import Organization
from data.location import Location

app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.app_context().push()


def seed_database():
    db.drop_all()
    db.create_all()
    test_org = Organization(organizationName="Kjell's taco", organizationNumber="1234567")
    boss_role = Role(name="boss", active=True)
    test_user = User(firstname="Kjell", lastname="Taco", password="test", username="kjelltaco", email="kjelltaco@taco.com", roleid=1, organizationid=1)
    db.session.add(test_org)
    db.session.add(boss_role)
    db.session.add(test_user)
    db.session.commit()

#seed_database()

if __name__ == "__main__":
    app.run("localhost", 8888, True)