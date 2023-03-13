from pydantic import BaseModel

class RoleBase(BaseModel):
    comment: str
    name: str
    active: bool

    class Config:
        orm_mode = True

class Role(RoleBase):
    id: int

class RoleCreate(RoleBase):
    pass

