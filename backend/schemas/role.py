from __future__ import annotations
from sqlalchemy import Column, Integer, String, Boolean
from database import Base
from schemas.serializer import Serializable

class Role(Base, Serializable):
    __tablename__ = "role"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    active = Column(Boolean, nullable=False)

    def __repr__(self):
        return '<Role %r>' % self.name