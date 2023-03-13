from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserCreate, User, LoginObject
import services.userservice as crud

api = APIRouter(
    prefix="/users",
    tags=['users']
)


@api.post("/", response_model=User)
def post_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    db_user_by_uname = crud.get_user_by_username(db, username=user.username)
    if db_user or db_user_by_uname:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@api.get("/<int:id>", response_model=User)
def get_user(id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user

@api.get("/", response_model=list[User])
def get_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users


@api.post("/login", response_model=User)
def user_login(login: LoginObject, db: Session = Depends(get_db)):
    user =  crud.get_user_by_username(db, login.username)
    if not user:
        raise HTTPException(status_code=404, detail="user with that username not found")

    if not user.verify_password(login.password):
        raise HTTPException(status_code=401, detail="invalid password")

    return user

@api.post("/qrlogin")
def login_user_qr():
    pass
