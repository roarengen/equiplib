from pydantic import BaseModel

class OrganizationHeader(BaseModel):
    number: str
    name: str

class OrganizationBase(OrganizationHeader):
    email: str | None = None
    phone: str | None = None
    city : str | None = None
    postalcode : str | None = None
    comment : str | None = None
    otherId : str | None = None
    other1 : str | None = None
    other2 : str | None = None
    templateid :int

    class Config:
        orm_mode = True

class OrganizationPatch(OrganizationBase):
    name: str | None = None
    number: str | None = None
    templateid: int | None = None

class Organization(OrganizationBase):
    id : int

class OrganizationCreate(OrganizationBase):
    pass
