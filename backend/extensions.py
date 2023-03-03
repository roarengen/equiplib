from flask_sqlalchemy import SQLAlchemy
from flask_apispec import FlaskApiSpec
from flask_cors import CORS
docs = FlaskApiSpec()
cors = CORS()
db = SQLAlchemy()

def seed_database():
    from data.user import User
    from data.role import Role
    from data.organization import Organization
    from data.location import Location
    from data.template import Template
    db.create_all()
    db.drop_all()
    db.create_all()
    test_temp = Template()
    test_org = Organization(organizationName="Kjell's taco", organizationNumber="1234567", templateid=1)
    boss_role = Role(name="boss", active=True)
    test_user = User(firstname="Kjell", lastname="Taco", password="test", username="kjelltaco", email="kjelltaco@taco.com", roleid=1, organizationid=1)
    db.session.add(test_temp)
    db.session.add(test_org)
    db.session.add(boss_role)
    db.session.add(test_user)
    db.session.commit()
