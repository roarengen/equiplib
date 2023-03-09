from extensions import db
from data.user import User
from data.equipment import Equipment
from data.location import Location
from data.serializer import Serializable

class Rent(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    equipmentid = db.Column(db.Integer, db.ForeignKey(Equipment.id), nullable=False)
    rentedFromDate = db.Column(db.Date, nullable=False)
    rentedValidToDate = db.Column(db.Date)
    rentedToDate = db.Column(db.Date)
    purpose = db.Column(db.String(80))
    comment = db.Column(db.Text)
    rentedFromLocation = db.Column(db.Integer, db.ForeignKey(Location.id))
    DeliveredToLocation = db.Column(db.Integer, db.ForeignKey(Location.id))

    def __repr__(self):
        return '<Rent %r>' % self.equipmentid

