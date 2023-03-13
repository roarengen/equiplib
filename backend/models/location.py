from pydantic import BaseModel

class LocationBase(BaseModel):
    organizationid: int
    name: str
    description: str| None = None
    active : bool

    class Config:
        orm_mode = True

class Equipment(LocationBase):
    id: int

class EquipmentCreate(LocationBase):
    pass

