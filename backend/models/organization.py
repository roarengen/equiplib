from pydantic import BaseModel

class OrganizationBase(BaseModel):
    number: str
    name: str
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


class Organization(OrganizationBase):
    id : int

class CreateOrganization(OrganizationBase):
    pass
