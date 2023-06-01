from sqlalchemy import Column, Integer, String, Text
from database import Base
from schemas.serializer import Serializable

class Template(Base, Serializable):
    __tablename__ = "template"
    id = Column(Integer, primary_key=True)
    name = Column(String(25), unique=True, nullable=False)
    equipName = Column(String(25))
    equipModel = Column(String(25))
    equipDescription = Column(String(25))
    equipType = Column(String(25))
    equipSerialnumber = Column(String(25))
    equipBrand = Column(String(25))
    equipOther1 = Column(String(25))
    equipOther2 = Column(String(25))
    equipOther3 = Column(String(25))
    equipComment = Column(String(25))
    userComment = Column(String(25))
    userOtherid = Column(String(25))
    userOther1 = Column(String(25))
    userOther2 = Column(String(25))
    orgOtherid = Column(String(25))
    orgOther1 = Column(String(25))
    orgOther2 = Column(String(25))
    rentPurpose = Column(String(25))
    rentComment = Column(Text)

    def __repr__(self):
        return '<Template>'
