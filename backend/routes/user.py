from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserCreate, User, LoginResponse, LoginRequest
from models.organization import OrganizationHeader
import services.userservice as crud
import services.orgservice as orgservice

from auth import make_token, require_admin, require_user

api = APIRouter(
    prefix="/users",
    tags=['users'],
)

@api.post("/", response_model=User, dependencies=[Depends(require_admin)]) # perhapas lender should be able to rent out
def post_user(user: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, email=user.email):
        logger.debug(f"new user tried to create with email duplicate: {user.email}")
        raise HTTPException(status_code=400, detail="email already registered")

    if crud.get_user_by_username(db, username=user.username):
        logger.debug(f"new user tried to create with username duplicate: {user.username}")
        raise HTTPException(status_code=400, detail="username already exists")

    logger.info(f"new user made: {user.username}")
    return crud.create_user(db=db, user=user)

@api.get("/{id}", response_model=User, dependencies=[Depends(require_user)])
def get_user(id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, id)
    if not user:
        logger.debug(f"requested user at id: {id} but no user with that id exists")
        raise HTTPException(status_code=404, detail="user not found")
    return user

@api.get("/", response_model=list[User], dependencies=[Depends(require_admin)])
def get_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users

@api.post("/login", response_model=LoginResponse, dependencies=[])
def user_login(login: LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, login.username)
    if not user:
        raise HTTPException(status_code=404, detail="user with that username not found")

    org = orgservice.get_org(db, user.organizationid)
    if not user.verify_password(login.password):
        logger.debug(f"{login.username} tried to login but entered the wrong password")
        raise HTTPException(status_code=401, detail="invalid password")

    return LoginResponse(
        user=user,
        org=OrganizationHeader(**org.__dict__),
        token=make_token(login.username, str(login.password))
    )

@api.post("/qrlogin")
def login_user_qr():
    pass
