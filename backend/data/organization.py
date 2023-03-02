from extensions import db
from data.serializer import Serializable

class Organization(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    organizationNumber = db.Column(db.String(80), unique=True, nullable=False)
    organizationName = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    postalcode = db.Column(db.String(80))
    comment = db.Column(db.String(80))
    otherId = db.Column(db.String(80))
    other1 = db.Column(db.String(80))
    other2 = db.Column(db.String(80))
    organizationOtherIdLabel = db.Column(db.String(80))
    organizationOther1Label = db.Column(db.String(80))
    organizationOther2Label = db.Column(db.String(80))
    userOtherIdLabel = db.Column(db.String(80))
    userOther1Label = db.Column(db.String(80))
    userOther2Label = db.Column(db.String(80))

