from sqlalchemy.orm import Session
from extensions import encrypt

import models.user
import schemas.user

def get_user(db: Session, user_id: int):
    return db.query(schemas.user.User).filter(schemas.user.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(schemas.user.User).filter(schemas.user.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(schemas.user.User).filter(schemas.user.User.username == username).first()

def get_users(db: Session, skip: int=0, limit: int= 100):
    return db.query(schemas.user.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: models.user.UserCreate):
    user.password = encrypt(user.password)
    new_user = schemas.user.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

