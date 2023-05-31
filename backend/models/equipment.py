from pydantic import BaseModel
from models.tag import Tag

class EquipmentBase(BaseModel):
    organizationid: int
    field1: str
    field2: str | None = None
    field3: str | None = None
    field4: str | None = None
    field5: str | None = None
    field6: str | None = None
    field7: str | None = None
    comment: str | None = None
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

