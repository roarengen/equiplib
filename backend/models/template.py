from sqlalchemy import Column, Integer, String, Text
from database import Base
from data.serializer import Serializable

class Template(Base, Serializable):
    id = Column(Integer, primary_key=True)
    name = Column(String(25), unique=True, nullable=False)
    equipName = Column(String(15))
    equipModel = Column(String(15))
    equipDescription = Column(String(15))
    equipType = Column(String(15))
    equipSerialnumber = Column(String(15))
    equipBrand = Column(String(15))
    equipOther1 = Column(String(15))
    equipOther2 = Column(String(15))
    equipOther3 = Column(String(15))
    equipComment = Column(String(15))
    userComment = Column(String(15))
    userOtherid = Column(String(15))
    userOther1 = Column(String(15))
    userOther2 = Column(String(15))
    orgOtherid = Column(String(15))
    orgOther1 = Column(String(15))
    orgOther2 = Column(String(15))
    rentPurpose = Column(String(15))
    rentComment = Column(Text)

    def __repr__(self):
        return '<Template>'
