from pydantic import BaseModel

class EquipmentBase(BaseModel):
    organizationid: int
    name: str
    model: str | None = None
    description: str| None = None
    type: str| None = None
    serialnumber: str| None = None
    brand: str| None = None
    other1: str| None = None
    other2: str| None = None
    other2: str| None = None
    comment: str| None = None
    locationid: int

    class Config:
        orm_mode = True

class Equipment(EquipmentBase):
    id: int
    active : bool = True

class EquipmentCreate(EquipmentBase):
    pass

