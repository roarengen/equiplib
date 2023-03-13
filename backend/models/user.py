from pydantic import BaseModel
from typing import Union, Optional
from datetime import datetime

class UserBase(BaseModel):
    roleid : int
    username : str
    lastname : str
    firstname : str
    email : str
    phone : Union[str, None] = None
    membershipid: Union[str, None] = None
    city: Union[str, None] = None
    dateOfBirth: datetime | None = None
    otherid : Union[str, None] = None
    other1 : Union[str, None] = None
    other2 : Union[str, None] = None
    activeFromDate : datetime | None = None
    activeToDate : datetime | None = None
    organizationid: int

class UserCreate(UserBase):
    password : str

class User(UserBase):
    id : int

    class Config:
        orm_mode = True
