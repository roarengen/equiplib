from pydantic import BaseModel
from datetime import datetime

from models import organization

class UserBase(BaseModel):
    roleid : int
    username : str
    lastname : str
    firstname : str
    email : str
    phone : str| None = None
    membershipid: str| None = None
    city: str| None = None
    dateOfBirth: datetime | None = None
    otherid : str| None = None
    other1 : str| None = None
    other2 : str| None = None
    activeFromDate : datetime | None = None
    activeToDate : datetime | None = None
    organizationid: int

class UserCreate(UserBase):
    password : str

class User(UserBase):
    id : int

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    password: str
    username: str

class LoginResponse(BaseModel):
    user: User
    org: organization.OrganizationHeader
    token: str