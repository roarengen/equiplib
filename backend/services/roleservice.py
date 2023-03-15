from sqlalchemy.orm import Session
from models.role import RoleCreate
from schemas import Role

def get_role(db: Session, id: int) -> Role | None:
    return db.query(Role).filter(Role.id == id).first()

def get_roles(db: Session, skip:int=0, limit:int=100) -> list[Role]:
    return db.query(Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: RoleCreate) -> Role:
    new_role = role(**role.dict())
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


