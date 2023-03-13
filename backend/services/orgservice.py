from sqlalchemy.orm import Session
from models.organization import CreateOrganization
from schemas import Organization

def get_org(db: Session, id: int):
    return db.query(Organization).filter(Organization.id == id).first()

def get_orgs(db: Session, skip:int=0, limit:int=100):
    return db.query(Organization).offset(skip).limit(limit).all()

def get_org_by_name(db: Session, name: str):
    return db.query(Organization).filter(Organization.name == name).first()

def get_org_by_org_number(db: Session, number: str):
    return db.query(Organization).filter(Organization.number == number).first()

def create_org(db: Session, org: CreateOrganization):
    new_org = Organization(**org.dict())
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    return new_org

