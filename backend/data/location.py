from extensions import db
from data.organization import Organization
from data.serializer import Serializable

class Location(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    organizationid = db.Column(db.Integer, db.ForeignKey(Organization.id), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(80))
    active = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Location %r>' % self.name
