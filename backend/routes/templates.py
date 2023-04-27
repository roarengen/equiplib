from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.template import Template, TemplateCreate
import services.templateservice as crud
import services.orgservice 
from auth import require_admin, require_leader, require_lender, require_user, require_user_to_be_in_org

api = APIRouter(
    prefix="/temps",
    tags=['temps'],
    dependencies=[Depends(require_user)]
)
@api.get("/", response_model=list[Template])
def get_temps(db: Session = Depends(get_db)):
    return crud.get_templates(db)

@api.get("/by_org/{orgid}", response_model=Template)
def get_temp(orgid: int = require_user_to_be_in_org, db: Session = Depends(get_db)):
    id = services.orgservice.get_org(db, orgid).id
    temp = crud.get_template(db, id)
    if not temp:
        return HTTPException(404, f"template not found with id: {id}")
    return temp

@api.get("/{id}", response_model=Template)
def get_temp(id: int, db: Session = Depends(get_db)):
    temp = crud.get_template(db, id)
    if not temp:
        return HTTPException(404, f"template not found with id: {id}")
    return temp

@api.post("/", response_model=Template, dependencies=[Depends(require_admin)])
def post_template(template: TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db, template)
