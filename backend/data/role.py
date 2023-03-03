from extensions import db
from data.serializer import Serializable

class Role(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    active = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Role %r>' % self.name
