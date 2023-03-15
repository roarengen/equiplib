from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.template import Template, TemplateCreate
import services.templateservice as crud

api = APIRouter(
    prefix="/temps",
    tags=['temps'],
)
@api.get("/", response_model=list[Template])
def get_temps(db: Session = Depends(get_db)):
    return crud.get_templates(db)

@api.get("/{id}", response_model=Template)
def get_temp(id: int, db: Session = Depends(get_db)):
    temp = crud.get_template(db, id)
    if not temp:
        return HTTPException(404, f"template not found with id: {id}")
    return temp

@api.post("/", response_model=Template)
def post_template(template: TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db, template)
