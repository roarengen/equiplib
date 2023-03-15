from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
#from sqlalchemy.orm import relationship
from database import Base

from schemas.organization import Organization
from schemas.location import Location
from schemas.serializer import Serializable

class Equipment(Base, Serializable):
    __tablename__ = "equpiment"

    id = Column(Integer, primary_key=True)
    organizationid = Column(Integer, ForeignKey(Organization.id), nullable=False)
    name = Column(String(80), nullable=False)
    model = Column(String(80))
    description = Column(String(80))
    type = Column(String(80))
    serialnumber = Column(String(80))
    brand = Column(String(80))
    other1 = Column(String(80))
    other2 = Column(String(80))
    other3 = Column(String(80))
    comment = Column(Text)
    locationid = Column(Integer, ForeignKey(Location.id), nullable=False)
    active = Column(Boolean, nullable=False)

    def __repr__(self):
        return '<Equipment %r>' % self.name
