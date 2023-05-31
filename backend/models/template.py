from pydantic import BaseModel

class TemplateBase(BaseModel):
    name : str | None = None
    equipField1: str | None = None
    equipField2: str | None = None
    equipField3: str | None = None
    equipField4: str | None = None
    equipField5: str | None = None
    equipField6: str | None = None
    equipField7: str | None = None
    equipHint1: str | None = None
    equipHint2: str | None = None
    equipHint3: str | None = None
    equipHint4: str | None = None
    equipHint5: str | None = None
    equipHint6: str | None = None
    equipHint7: str | None = None
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

