from sqlalchemy.orm import Session, joinedload
from models.tag import TagCreate
from schemas.equipment import Tag
from models.equipment import EquipmentCreate
from schemas import Equipment

def get_equip(db: Session, id: int) -> Equipment | None:
    return db.query(Equipment).filter(Equipment.id == id).first()

def get_equips(db: Session) -> list[Equipment]:
    return db.query(Equipment).options(joinedload(Equipment.tags)).all()

def get_equips_by_name(db: Session, name: str) -> list[Equipment]:
    return db.query(Equipment).filter(Equipment.name == name).all()

def get_equips_by_org_id(db: Session, orgid: int) -> list[Equipment] | None:
    return db.query(Equipment).filter(Equipment.organizationid == orgid).all()

def remove_equip(db: Session, id: int) -> None:
    db.delete(db.query(Equipment).filter(Equipment.id == id).first())

def update_equip(db: Session, id: int, **kwargs) -> Equipment:
    eq = db.query(Equipment).filter(Equipment.id == id).first()
    for key, val in kwargs.items():
        if val != None:
            setattr(eq, key, val)
    db.commit()
    db.refresh(eq)
    return eq

def enable_equip(db: Session, id: int) -> Equipment | None:
    eq = db.query(Equipment).filter(Equipment.id == id).first()
    if eq:
        eq.active = True
        db.commit()
        db.refresh(eq)
        return eq

def disable_equip(db: Session, id: int) -> Equipment | None:
    eq = db.query(Equipment).filter(Equipment.id == id).first()
    if eq:
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

def create_tag(db: Session, tag: TagCreate) -> Tag:
    new_tag = Tag(**tag.dict())
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

def get_tags_by_orgid(db: Session, orgid: int):
    return db.query(Tag).where(Tag.organizationid == orgid).all()

def add_tag_to_equip(db: Session, equipid: int, tagid: int) -> None | Equipment:
    equipment = db.query(Equipment).where(Equipment.id == equipid).first()
    tag = db.query(Tag).where(Tag.id == tagid).first()
    if tag and equipment:
        equipment.tags.append(tag)
        db.commit()
        db.refresh(equipment)
        return equipment
