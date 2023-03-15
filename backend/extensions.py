import bcrypt
import base64
import logging
from logging.handlers import SysLogHandler
from datetime import datetime
from fastapi import Header, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from enum import IntEnum, auto
from fastapi.security import HTTPBasicCredentials, HTTPBasic 
from schemas.user import User

import services.userservice  

formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler = logging.FileHandler("log.log", mode="a+")
file_handler.setFormatter(formatter)
try:
    import secret
    sys_log_handler = SysLogHandler(address=secret.SYSLOG_ADDRESS)
    sys_log_handler.setFormatter(formatter)
except:
    sys_log_handler = None


class ROLES(IntEnum):
    USER = auto()
    LENDER = auto()
    ADMIN = auto()
    LEADER = auto()

def get_user_from_token(db: Session, username: str,password:str) -> User:
    user = services.userservice.get_user_by_username(db, username)
    if not user or not user.verify_password(password):
        raise HTTPException(401)
    return user

def require_user(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)):
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.USER:
        raise HTTPException(403)

def require_lender(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)):
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.LENDER:
        raise HTTPException(403)

def require_admin(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)):
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.ADMIN:
        raise HTTPException(403)

def require_leader(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)):
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.LEADER:
        raise HTTPException(403)


def make_token(username: str, password: str):
    return base64.b64encode((username + ":" + password).encode("ascii")).decode("ascii")

class RESPONSE_CODES:
    SUCCESS = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 403
    NOT_FOUND = 404
    SERVER_ERROR = 500

def encrypt(data: str) -> str:
    return bcrypt.hashpw(data.encode("utf-8"), bcrypt.gensalt(10)).decode("utf-8")


def datetime_from_string(datetime_string: str) -> datetime:
    return datetime.strptime(datetime_string, "%a, %d %b %Y %H:%M:%S %Z")
