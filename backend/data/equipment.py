from extensions import db
from data.organization import Organization
from data.location import Location
from data.serializer import Serializable

class Equipment(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    organizationid = db.Column(db.Integer, db.ForeignKey(Organization.id), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(80))
    description = db.Column(db.String(80))
    type = db.Column(db.String(80))
    serialnumber = db.Column(db.String(80))
    brand = db.Column(db.String(80))
    locationid = db.Column(db.Integer, db.ForeignKey(Location.id), nullable=False)
    active = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Equipment %r>' % self.name
