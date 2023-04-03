from pydantic import BaseModel

class TagBase(BaseModel):
    name: str
    color: str
    active: bool

    class Config:
        orm_mode = True

class Tag(TagBase):
    id: int

class TagCreate(TagBase):
    pass
