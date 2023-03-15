from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
#from sqlalchemy.orm import relationship
from database import Base
from schemas.organization import Organization
from schemas.serializer import Serializable

class Location(Base, Serializable):
    __tablename__ = "location"

    id = Column(Integer, primary_key=True)
    organizationid = Column(Integer, ForeignKey(Organization.id), nullable=False)
    name = Column(String(80), nullable=False)
    description = Column(String(80))
    active = Column(Boolean, nullable=False)

    def __repr__(self):
        return '<Location %r>' % self.name
