from extensions import db
from data.organization import Organization
from data.role import Role
from data.serializer import Serializable
import bcrypt

class User(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    roleid = db.Column(db.Integer, db.ForeignKey(Role.id), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    lastname = db.Column(db.String(80), unique=False, nullable=False)
    firstname = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    membershipid = db.Column(db.String(80))
    city = db.Column(db.String(80))
    postalcode = db.Column(db.String(80))
    dateOfBirth = db.Column(db.Date)
    comment = db.Column(db.String(80))
    otherid = db.Column(db.String(80))
    other1 = db.Column(db.String(80))
    other2 = db.Column(db.String(80))
    activeFromDate = db.Column(db.Date)
    activeToDate = db.Column(db.Date)
    organizationid = db.Column(db.Integer, db.ForeignKey(Organization.id), nullable=False)

    def verify_password(self, password: str) -> bool:
        return self.password == bcrypt.hashpw(password.encode("utf-8"), self.password.encode("utf-8")).decode("utf-8")

    def __repr__(self):
        return '<User %r>' % self.username
