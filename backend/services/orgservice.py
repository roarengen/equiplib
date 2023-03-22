from sqlalchemy.orm import Session
from models.organization import OrganizationCreate
from schemas import Organization

def get_org(db: Session, id: int) -> Organization | None:
    return db.query(Organization).filter(Organization.id == id).first()

def get_orgs(db: Session, skip:int=0, limit:int=100) -> list[Organization]:
    return db.query(Organization).offset(skip).limit(limit).all()

def get_org_by_name(db: Session, name: str) -> Organization | None:
    return db.query(Organization).filter(Organization.name == name).first()

def get_org_by_org_number(db: Session, number: str) -> Organization | None:
    return db.query(Organization).filter(Organization.number == number).first()

def create_org(db: Session, org: OrganizationCreate) -> Organization:
    new_org = Organization(**org.dict())
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    return new_org

def delete_org(db: Session, orgid : int) -> None:
    org = db.query(Organization).filter(Organization.id == orgid).first()
    db.delete(org)
    db.commit()


