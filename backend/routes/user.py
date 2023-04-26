from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from extensions import encrypt
from models.user import UserPatch
from database import get_db
from models.user import UserCreate, User, LoginResponse, LoginRequest
import services.userservice as crud
from services import emailservice
import jwt

from auth import make_token, require_admin, require_user

api = APIRouter(
    prefix="/users",
    tags=['users'],
)

@api.post("/", response_model=User, dependencies=[Depends(require_admin)]) # perhaps lender should be able to rent out
def post_user(user: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, email=user.email):
        logger.debug(f"new user tried to create with email duplicate: {user.email}")
        raise HTTPException(status_code=400, detail="email already registered")

    if crud.get_user_by_username(db, username=user.username):
        logger.debug(f"new user tried to create with username duplicate: {user.username}")
        raise HTTPException(status_code=400, detail="username already exists")

    logger.info(f"new user made: {user.username}")
    return crud.create_user(db=db, user=user)

@api.post("/forgot_password")
def forgot_password(
        email: str | None = None,
        username: str | None = None
        , db: Session = Depends(get_db)):

    user = None
    if email or username:
        if email:
            user = crud.get_user_by_email(db, email)
        elif username:
            user = crud.get_user_by_username(db, username)
    else:
        return HTTPException(400, "no email or username provided")

    if user:
        emailservice.send_email(str(user.email), "") #TODO JWT token goes here
        return HTTPException(404, "no user with the email was found")

@api.get("/reset_password")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    user = None
    credentials = jwt.decode(token)

    if credentials['id']:
        user = crud.get_user(db, credentials['id'])

    if user:
        if user.password == credentials['password']:
            crud.update_user(db, credentials['id'], password=encrypt(new_password))

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
    users = crud.get_users_in_org(db, user.organizationid)
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
