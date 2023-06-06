from pydantic import BaseModel
from datetime import datetime

class RentBase(BaseModel):
    userid: int
    equipmentid: int
    rentedFromDate: datetime
    rentedValidToDate: datetime | None = None
    rentedToDate: datetime | None = None
    purpose: str| None = None
    comment: str| None = None
    rentedFromLocation: int | None = None
    deliveredToLocation : int | None = None
    rentedFromUserid: int | None = None
    deliveredToUserid : int | None = None

    class Config:
        orm_mode = True

class Rent(RentBase):
    id: int

class RentCreate(RentBase):
    pass

class RentReturn(BaseModel):
    rentid: int
    locationid: int
    userid: int
    returndate: datetime

