from sqlalchemy.orm import Session
from models.location import LocationCreate
from schemas import Location

def get_location(db: Session, id: int) -> Location | None:
    return db.query(Location).filter(Location.id == id).first()

def get_locations(db: Session, skip: int = 0, limit: int = 100) -> list[Location]: 
    return db.query(Location).offset(skip).limit(limit).all()

def get_location_by_name(db: Session, name: str) -> Location | None:
    return db.query(Location).filter(Location.name == name).first()

def get_locations_by_orgid(db: Session, orgid: int) -> list[Location]:
    return db.query(Location).filter(Location.organizationid == orgid).all()

def disable_location(db: Session, id: int) -> Location | None:
    loc = db.query(Location).filter(Location.id==id).first()
    if not loc:
        return None
    loc.active = False
    db.commit()
    db.refresh(loc)
    return loc

def enable_location(db: Session, id: int) -> Location:
    loc = db.query(Location).filter(Location.id==id).first()
    loc.active = True
    db.commit()
    db.refresh(loc)
    return loc


def create_location(db: Session, location: LocationCreate):
    new_location = Location(**location.dict())
    db.add(new_location)
    db.commit()
    db.refresh(new_location)
    return new_location
