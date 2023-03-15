from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.logger import logger
from database import get_db
from models.role import Role, RoleCreate
import services.roleservice as crud
from auth import require_leader

api = APIRouter(
    prefix="/roles",
    tags=['roles'],
)

@api.get("/", response_model=list[Role])
def get_roles(db: Session = Depends(get_db)):
    return crud.get_roles(db)

@api.post("/", response_model=Role, dependencies=[Depends(require_leader)])
def post_roles(role: RoleCreate, db: Session = Depends(get_db)):
    return crud.create_role(db, role)

@api.get("/{id}", response_model=Role)
def get_role(id, db: Session = Depends(get_db)):
    role = crud.get_role(db, id)
    if not role:
        return HTTPException(404, f"role not found with id: {id}")
    return role
