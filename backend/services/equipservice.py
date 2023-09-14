from backend.models.location import Location
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

def get_equips_by_org_id(db: Session, orgid: int) -> list[Equipment]:
    return db.query(Equipment).filter(Equipment.organizationid == orgid).all()

def get_tag_by_id(db: Session, tagid: int) -> Tag | None:
    return db.query(Tag).filter(Tag.id == tagid).first()

def get_tags_by_orgid(db: Session, orgid: int):
    return db.query(Tag).where(Tag.organizationid == orgid).all()

def get_location_by_equipid(db: Session, equipid: int) -> Location | None:
    return db.query(Location).where(Equipment.locationid == Location.id).filter(Equipment.id == equipid)

def remove_equip(db: Session, id: int) -> None:
    db.delete(db.query(Equipment).filter(Equipment.id == id).first())

def update_equip(db: Session, eq_id: int, **kwargs) -> Equipment:
    eq = db.query(Equipment).filter(Equipment.id == eq_id).first()
    for key, val in kwargs.items():
        if val != None and hasattr(eq, key):
            setattr(eq, key, val)
    db.commit()
    db.refresh(eq)
    return eq

def update_tag(db: Session, tag_id: int, **kwargs) -> Tag:
    eq = db.query(Tag).filter(Tag.id == tag_id).first()
    for key, val in kwargs.items():
        if val != None and hasattr(eq, key):
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
    if not eq:
        return None

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


def disable_tag(db: Session, tagid: int) -> Tag | None:
    tag = db.query(Tag).filter(Tag.id == tagid).first()
    if not tag:
        return None

    tag.active = False
    db.commit()
    db.refresh(tag)
    return tag

def enable_tag(db: Session, tagid: int) -> Tag | None:
    tag = db.query(Tag).filter(Tag.id == tagid).first()
    if not tag:
        return None

    tag.active = True
    db.commit()
    db.refresh(tag)
    return tag

def remove_tag_from_equip(db: Session, equipid: int, tagid: int) -> None | Tag:
    equipment = db.query(Equipment).where(Equipment.id == equipid).first()
    if equipment:
        for tag in equipment.tags:
            if tag.id == tagid:
                equipment.tags.remove(tagid)
                db.commit()
                db.refresh(equipment)
                return Tag

    return None

def add_tag_to_equip(db: Session, equipid: int, tagid: int) -> None | Equipment:
    equipment = db.query(Equipment).where(Equipment.id == equipid).first()
    tag = db.query(Tag).where(Tag.id == tagid).first()
    if tag and equipment:
        equipment.tags.append(tag)
        db.commit()
        db.refresh(equipment)
        return equipment
