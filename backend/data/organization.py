from extensions import db
from data.serializer import Serializable
from data.template import Template

class Organization(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    organizationNumber = db.Column(db.String(80), unique=True, nullable=False)
    organizationName = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    street = db.Column(db.String(80))
    city = db.Column(db.String(80))
    postalcode = db.Column(db.String(80))
    comment = db.Column(db.String(80))
    otherId = db.Column(db.String(80))
    other1 = db.Column(db.String(80))
    other2 = db.Column(db.String(80))
    templateid = db.Column(db.Integer, db.ForeignKey(Template.id), nullable=False)

    def __repr__(self):
        return '<Organization %r>' % self.organizationName
