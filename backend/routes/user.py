from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from extensions import encrypt
from models.user import UserPatch
from database import get_db
from models.user import UserCreate, User, LoginResponse, LoginRequest, ResetPassword
import services.userservice as crud
from services import emailservice
import jwt

JWT_TOKEN_KEY = "makesomeshitup"
from auth import make_token, require_admin, require_user

api = APIRouter(
    prefix="/users",
    tags=['users'],
)

@api.post("/register", response_model=User, dependencies=[Depends(require_admin)]) # perhaps lender should be able to rent out
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
        db: Session = Depends(get_db)):

    user = None
    if email:
        user = crud.get_user_by_email(db, email)
    else:
        raise HTTPException(400, "no email or username provided")

    if user:
        token = jwt.encode({'password' : user.password, 'id' : user.id}, JWT_TOKEN_KEY, algorithm="HS256")
        emailservice.send_email(
            email=str(user.email),
            subject="forgot password",
            content=f"""
            click the below link to reset your password! \n
            https://manageyour.equipment/reset_password?token={token} \n
            (don't share this link with anyone, please)
            """)

        return

    raise HTTPException(404, "no user with the email was found")

@api.post("/reset_password")
def reset_password(reset_password: ResetPassword, db: Session = Depends(get_db)):
    user = None
    try:
        credentials = jwt.decode(reset_password.token, JWT_TOKEN_KEY, algorithms=["HS256"])

    except jwt.exceptions.DecodeError:
        raise HTTPException(400, "unparseable token")

    if credentials['id']:
        user = crud.get_user(db, credentials['id'])

    if user:
        if user.password == credentials['password']:
            crud.update_user(db, credentials['id'], password=encrypt(reset_password.new_password))

            return
        else:
            raise HTTPException(403, "password missmatch")

    raise HTTPException(400, "invalid token")


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
            return list(filter(lambda x: x.isactive == onlyactive, users))
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
