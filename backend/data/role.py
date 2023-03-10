from __future__ import annotations
from extensions import db
from data.serializer import Serializable
from enum import Enum

class Role(db.Model, Serializable):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    active = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Role %r>' % self.name

class ROLES(Enum):
    USER = "bruker"
    LENDER = "utstyrsansvarlig"
    ADMIN = "administrator"
    LEADER = "leder"

    @staticmethod
    def get_role_by_name(name : ROLES | str) -> Role | None:
        return Role.query.filter(Role.name == name).first()

    @staticmethod
    def get_role_by_id(id: int)-> Role | None:
        return Role.query.filter(Role.id == id).first()
