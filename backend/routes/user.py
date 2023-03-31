from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from models.user import UserPatch
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

@api.put("/{id}", response_model=User, dependencies=[Depends(require_user)])
def put_user(id: int, user_info: User, db: Session = Depends(get_db)):
    user = crud.update_user(db, id, **user_info.dict())
    return user

@api.patch("/{id}", response_model=User, dependencies=[Depends(require_user)])
def patch_user(id: int, user_info: UserPatch, db: Session = Depends(get_db)):
    user = crud.update_user(db, id, **user_info.dict())
    return user

@api.get("/{id}", response_model=User, dependencies=[Depends(require_user)])
def get_user(id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, id)
    if not user:
        logger.debug(f"requested user at id: {id} but no user with that id exists")
        raise HTTPException(status_code=404, detail="user not found")
    return user

@api.get("/", response_model=list[User])
def get_users(onlyactive: bool = True, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    users: list[User] = crud.get_users_in_org(db, user.organizationid)
    if users:
        if onlyactive:
            return list(filter(lambda x: x.isactive == onlyactive, [user for user in users]))
        else:
            return users
    raise HTTPException(404, "no users found in your org")

@api.get("/me", response_model=User)
def get_my_user(user : User = Depends(require_user)):
    return user

@api.post("/login", response_model=LoginResponse, dependencies=[])
def user_login(login: LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, login.username)
    if not user:
        raise HTTPException(status_code=404, detail="user with that username not found")

    if not user.verify_password(login.password):
        logger.debug(f"{login.username} tried to login but entered the wrong password")
        raise HTTPException(status_code=401, detail="invalid password")

    return LoginResponse(
        user=user,
        token=make_token(login.username, str(login.password))
    )

@api.post("/qrlogin")
def login_user_qr():
    pass
