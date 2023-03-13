from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
#from sqlalchemy.orm import Relationship
from database import Base
from schemas.organization import Organization
from schemas.role import Role
from schemas.serializer import Serializable

class User(Base, Serializable):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    roleid = Column(Integer, ForeignKey(Role.id), nullable=False)
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(80), nullable=False)
    lastname = Column(String(80), unique=False, nullable=False)
    firstname = Column(String(80), unique=False, nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(20))
    membershipid = Column(String(80))
    city = Column(String(80))
    postalcode = Column(String(80))
    dateOfBirth = Column(DateTime)
    comment = Column(String(80))
    otherid = Column(String(80))
    other1 = Column(String(80))
    other2 = Column(String(80))
    activeFromDate = Column(DateTime)
    activeToDate = Column(DateTime)
    organizationid = Column(Integer, ForeignKey(Organization.id), nullable=False)
