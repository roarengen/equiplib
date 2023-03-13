from database import Base
from sqlalchemy import Column, Integer, ForeignKey, String, Text, Date
from schemas.user import User
from schemas.equipment import Equipment
from schemas.location import Location
from schemas.serializer import Serializable

class Rent(Base, Serializable):
    __tablename__ = "rent"

    id = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey(User.id), nullable=False)
    equipmentid = Column(Integer, ForeignKey(Equipment.id), nullable=False)
    rentedFromDate = Column(Date, nullable=False)
    rentedValidToDate = Column(Date)
    rentedToDate = Column(Date)
    purpose = Column(String(80))
    comment = Column(Text)
    rentedFromLocation = Column(Integer, ForeignKey(Location.id))
    deliveredToLocation = Column(Integer, ForeignKey(Location.id))

    def __repr__(self):
        return '<Rent %r>' % self.equipmentid

