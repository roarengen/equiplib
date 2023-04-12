from pydantic import BaseModel
from models.tag import Tag

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

class EquipmentPatch(EquipmentBase):
    organizationid: int | None = None
    name: str | None = None
    locationid: int | None = None

class Equipment(EquipmentBase):
    id: int
    active : bool = True
    tags: list[Tag] | None = None

class EquipmentCreate(EquipmentBase):
    pass

