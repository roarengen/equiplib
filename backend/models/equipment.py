from pydantic import BaseModel
from typing import Optional, Union

class EquipmentBase(BaseModel):
    id: int
    organizationid: int
    name: str
    model: Union[str, None] = None
    description: Union[str, None] = None
    type: Union[str, None] = None
    serialnumber: Union[str, None] = None
    brand: Union[str, None] = None
    other1: Union[str, None] = None
    other2: Union[str, None] = None
    other2: Union[str, None] = None
    comment: Union[str, None] = None
    locationid: int
    active : bool

class EquipmentCreate(EquipmentBase):
    id: int
    organizationid: int
    name: str
    model: Optional[str]
    description: Optional[str]
    type: Optional[str]
    serialnumber: Optional[str]
    brand: Optional[str]
    other1: Optional[str]
    other2: Optional[str]
    other2: Optional[str]
    comment: Optional[str]
    locationid: int
    active : bool

