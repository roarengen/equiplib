from pydantic import BaseModel

class TemplateBase(BaseModel):
    name : str | None = None
    equipName : str | None = None
    equipModel : str | None = None
    equipDescription : str | None = None
    equipType : str | None = None
    equipSerialnumber : str | None = None
    equipBrand : str | None = None
    equipOther1 : str | None = None
    equipOther2 : str | None = None
    equipOther3 : str | None = None
    equipComment: str | None = None
    userComment : str | None = None
    userOtherid : str | None = None
    userOther1 : str | None = None
    userOther2 : str | None = None
    orgOtherid : str | None = None
    orgOther1 : str | None = None
    orgOther2 : str | None = None
    rentPurpose : str | None = None
    rentComment : str | None = None

    class Config:
        orm_mode = True

class Template(TemplateBase):
    id: int

class TemplateCreate(TemplateBase):
    pass

