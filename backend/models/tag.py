from pydantic import BaseModel, validator

class TagBase(BaseModel):
    name: str
    color: str
    active: bool

    class Config:
        orm_mode = True

class Tag(TagBase):
    id: int

class TagCreate(TagBase):
    organizationid: int

    @validator('color')
    def color_hexargb(cls, v: str):
        if len(v) != 7:
            raise ValueError("expected length of color value is 7, got {len}" % len(v))
        if v[0] != '#':
            raise ValueError("missing mandatory hexacedimal color prefix '#'")
        return v
