from sqlalchemy.orm import Session
from extensions import encrypt

from models.user import UserCreate
from schemas import User

def get_user(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()

def get_users_in_org(db: Session, orgid: int) -> list[User] | None:
    return db.query(User).filter(User.organizationid == orgid).all()

def get_users(db: Session, skip: int=0, limit: int= 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()

def get_users_with_role(db: Session, roleid: int) -> list[User]:
    return db.query(User).filter(User.roleid == roleid).all()

def update_user(db: Session, user_id: int, **kwargs):
    user = db.query(User).filter(User.id == user_id).first()
    for key, value in kwargs.items():
        if value != None and hasattr(user, key):
            setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def create_user(db: Session, user: UserCreate):
    user.password = encrypt(user.password)
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

