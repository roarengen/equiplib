from sqlalchemy.orm import Session
from models.equipment import EquipmentCreate
from schemas import Equipment

def get_equip(db: Session, id: int) -> Equipment:
    return db.query(Equipment).filter(Equipment.id == id).first()

def get_equips(db: Session, skip:int=0, limit:int=100) -> list[Equipment]:
    return db.query(Equipment).offset(skip).limit(limit).all()

def get_equips_by_name(db: Session, name: str) -> list[Equipment]:
    return db.query(Equipment).filter(Equipment.name == name).all()

def get_equips_by_org_id(db: Session, orgid: str) -> Equipment:
    return db.query(Equipment).filter(Equipment.organizationid == orgid).all()

def remove_equip(db: Session, id: str) -> None:
    db.delete(db.query(Equipment).filter(id).first())

def update_equip(db: Session, id: str, **kwargs : dict) -> Equipment:
    eq = db.query(Equipment).filter(id).first()
    for key, val in kwargs.items():
        setattr(eq, key, val)
    db.commit()
    db.refresh(eq)
    return eq

def enable_equip(db: Session, id: str) -> Equipment:
    eq = db.query(Equipment).filter(id).first()
    eq.active = True
    db.commit()
    db.refresh(eq)
    return eq
    
def disable_equip(db: Session, id: str) -> Equipment:
    eq = db.query(Equipment).filter(id).first()
    eq.active = False
    db.commit()
    db.refresh(eq)
    return eq

def create_equip(db: Session, equip: EquipmentCreate) -> Equipment:
    new_equip = Equipment(**equip.dict(), active=True)
    db.add(new_equip)
    db.commit()
    db.refresh(new_equip)
    return new_equip

