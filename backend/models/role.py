from sqlalchemy import Column, Integer, String, Boolean
from database import Base
from __future__ import annotations
from schemas.serializer import Serializable
from enum import Enum

class Role(Base, Serializable):
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    active = Column(Boolean, nullable=False)

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
