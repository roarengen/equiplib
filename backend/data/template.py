from extensions import db 
from data.serializer import Serializable

class Template(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    name =  equipName = db.Column(db.String(25))
    equipName = db.Column(db.String(15))
    equipModel = db.Column(db.String(15))
    equipDescription = db.Column(db.String(15))
    equipType = db.Column(db.String(15))
    equipSerialnumber = db.Column(db.String(15))
    equipBrand = db.Column(db.String(15))
    userComment = db.Column(db.String(15))
    userOtherid = db.Column(db.String(15))
    userOther1 = db.Column(db.String(15))
    userOther2 = db.Column(db.String(15))
    orgOtherid = db.Column(db.String(15))
    orgOther1 = db.Column(db.String(15))
    orgOther2 = db.Column(db.String(15))
    rentPurpose = db.Column(db.String(15))
    rentComment = db.Column(db.Text)

    def __repr__(self):
        return '<Template>'
