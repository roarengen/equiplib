from sqlalchemy.orm import Session
from extensions import encrypt

from models.user import UserCreate
from schemas import User

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int=0, limit: int= 100):
    return db.query(User).offset(skip).limit(limit).all()

def get_users_with_role(db: Session, roleid: int):
    return db.query(User).filter(User.roleid == roleid).all()

def create_user(db: Session, user: UserCreate):
    user.password = encrypt(user.password)
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

