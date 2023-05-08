from datetime import datetime
from sqlalchemy.orm import Session
from models.rent import RentCreate
from schemas import Rent
from schemas import User
from schemas import Equipment

def get_rent(db: Session, id: int) -> Rent | None:
    return db.query(Rent).filter(Rent.id == id).first()

def get_rent_by_equipid(db: Session, id: int) -> Rent | None:
    return db.query(Rent).filter(Rent.equipmentid == id).first()

def get_rents(db: Session, skip:int=0, limit:int=100) -> list[Rent]:
    return db.query(Rent).offset(skip).limit(limit).all()

def get_rents_by_userid(db: Session, userid: int) -> list[Rent]:
    return db.query(Rent).filter(Rent.userid == userid).all()

def return_rent(db: Session, rentid: int, locationid: int, userid: int) -> Rent | None:
    rent = db.query(Rent).filter(Rent.id == rentid).first()
    equipment = db.query(Equipment).filter(Equipment.id == rent.equipmentid).first()
    now = datetime.now()
    if rent and equipment:
        equipment.locationid = locationid
        rent.deliveredToLocation = locationid
        rent.rentedToDate = now.date()
        rent.deliveredToUserid = userid
        db.commit()
        db.refresh(rent)
        return rent

def deliver_to_location(db: Session, rentid: int, locationid: int, time: datetime) -> Rent | None:
    rent = db.query(Rent).filter(Rent.id == rentid).first()
    if rent:
        rent.deliveredToLocation = locationid
        rent.rentedToDate = time
        db.commit()
        db.refresh(rent)
        return rent

def get_rents_by_orgid(db: Session, orgid: int) -> list[Rent]:
    users: list[User] = db.query(User).filter(User.organizationid==orgid).all()
    if not users:
        return []
    userids = [user.id for user in users]
    rents: list[Rent] = db.query(Rent).filter(Rent.userid.in_((userids))).all()
    if not rents:
        return []
    return rents

def create_rent(db: Session, rent: RentCreate) -> Rent:
    new_rent = Rent(**rent.dict())
    db.add(new_rent)
    db.commit()
    db.refresh(new_rent)
    return new_rent


