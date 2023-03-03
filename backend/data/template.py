from extensions import db 
from data.serializer import Serializable

class Template(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    orgName = db.Column(db.String(15))
    orgModel = db.Column(db.String(15))
    orgDescription = db.Column(db.String(15))
    orgType = db.Column(db.String(15))
    orgSerialnumber = db.Column(db.String(15))
    orgBrand = db.Column(db.String(15))
    userComment = db.Column(db.String(15))
    userOtherid = db.Column(db.String(15))
    userOther1 = db.Column(db.String(15))
    userOther2 = db.Column(db.String(15))
    rentPurpose = db.Column(db.String(15))
    rentComment = db.Column(db.Text)