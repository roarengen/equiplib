from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import services.orgservice as crud
from database import get_db
from models.organization import Organization, OrganizationCreate

api = APIRouter(
    prefix="/orgs",
    tags=["orgs"]
)

@api.get("/", response_model=list[Organization])
def get_orgs(db : Session = Depends(get_db)):
    return crud.get_orgs(db)

@api.get("/{id}", response_model=Organization)
def get_org(id: int, db : Session = Depends(get_db)):
    org = crud.get_org(db, id)
    if not org:
        return HTTPException(status_code=404, detail="org not found")
    return org

@api.post("/", response_model=Organization)
def post_org(org: OrganizationCreate, db : Session = Depends(get_db)):
    if crud.get_org_by_name(db, org.name):
        return HTTPException(status_code=400, detail="org name already registered")
    if crud.get_org_by_org_number(db, org.number):
        return HTTPException(status_code=400, detail="org number already registered")

    return crud.create_org(db, org)
