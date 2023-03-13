from sqlalchemy.orm import Session
from models.equipment import EquipmentCreate
from schemas import Equipment

def get_equip(db: Session, id: int):
    return db.query(Equipment).filter(Equipment.id == id).first()

def get_equips(db: Session, skip:int=0, limit:int=100):
    return db.query(Equipment).offset(skip).limit(limit).all()

def get_equips_by_name(db: Session, name: str):
    return db.query(Equipment).filter(Equipment.name == name).all()

def get_equips_by_org_number(db: Session, orgid: str):
    return db.query(Equipment).filter(Equipment.organizationid == orgid).first()

def create_equip(db: Session, equip: EquipmentCreate):
    new_equip = Equipment(**equip.dict())
    db.add(new_equip)
    db.commit()
    db.refresh(new_equip)
    return new_equip

