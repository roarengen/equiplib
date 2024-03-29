from fastapi import APIRouter, HTTPException, Depends
from fastapi.logger import logger
from sqlalchemy.orm import Session
import services.orgservice as crud
from database import get_db
from models.organization import Organization, OrganizationCreate, OrganizationPatch
from models.user import User
from auth import require_admin, require_user_to_be_in_org, require_leader, require_user

api = APIRouter(
    prefix="/orgs",
    tags=["orgs"]
)

@api.get("/", response_model=list[Organization])
def get_orgs(db : Session = Depends(get_db)):
    return crud.get_orgs(db)

@api.get("/{orgid}", response_model=Organization)
def get_org(orgid: int = Depends(require_user_to_be_in_org), db : Session = Depends(get_db)):
    org = crud.get_org(db, orgid)
    if not org:
        return HTTPException(status_code=404, detail="org not found")
    return org

@api.put("/{id}", response_model=Organization, dependencies=[Depends(require_admin)])
def put_org(id: int, org_info: Organization, db: Session = Depends(get_db)):
    return crud.update_org(db, id, **org_info.dict())

@api.patch("/{id}", response_model=Organization, dependencies=[Depends(require_admin)])
def patch_org(id: int, org_info: OrganizationPatch, db: Session = Depends(get_db)):
    return crud.update_org(db, id, **org_info.dict())

@api.get("/me", response_model=Organization)
def get_my_org(db: Session = Depends(get_db), user : User = Depends(require_user)):
    return crud.get_org(db, user.organizationid)

@api.post("/", response_model=Organization, dependencies=[Depends(require_leader)])
def post_org(org: OrganizationCreate, db : Session = Depends(get_db)):
    if crud.get_org_by_name(db, org.name):
        logger.debug(f"tried to register org with data: {org}, but name already registered")
        return HTTPException(status_code=400, detail="org name already registered")

    if crud.get_org_by_org_number(db, org.number):
        logger.debug(f"tried to register org with data: {org}, but orgnumber already registered")
        return HTTPException(status_code=400, detail="org number already registered")

    logger.info(f"new organization registered: {org.name}")
    return crud.create_org(db, org)
