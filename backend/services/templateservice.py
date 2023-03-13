from sqlalchemy.orm import Session
from models.template import TemplateCreate
from schemas import Template

def get_template(db: Session, id: int) -> Template:
    return db.query(Template).filter(Template.id == id).first()

def get_templates(db: Session, skip:int=0, limit:int=100) -> list[Template]:
    return db.query(Template).offset(skip).limit(limit).all()

def get_template_by_name(db: Session, name: str) -> Template:
    return db.query(Template).filter(Template.name == name).first()

def create_template(db: Session, template: TemplateCreate) -> Template:
    new_template = Template(**template.dict())
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    return new_template
