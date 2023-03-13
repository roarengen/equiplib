from sqlalchemy import Column, String, Integer, ForeignKey
from database import Base
from schemas.serializer import Serializable
from schemas.template import Template

class Organization(Base, Serializable):
    __tablename__ = "organization"

    id = Column(Integer, primary_key=True)
    number = Column(String(80), unique=True, nullable=False)
    name = Column(String(80), unique=True, nullable=False)
    email = Column(String(120))
    phone = Column(String(20))
    street = Column(String(80))
    city = Column(String(80))
    postalcode = Column(String(80))
    comment = Column(String(80))
    otherId = Column(String(80))
    other1 = Column(String(80))
    other2 = Column(String(80))
    templateid = Column(Integer, ForeignKey(Template.id), nullable=False)

    def __repr__(self):
        return '<Organization %r>' % self.organizationName
