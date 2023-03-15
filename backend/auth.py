import services.userservice
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBasicCredentials, HTTPBasic
from models.user import User
from extensions import ROLES
from sqlalchemy.orm import Session
from database import get_db

import base64

def get_user_from_token(db: Session, username: str,password:str) -> User:
    user = services.userservice.get_user_by_username(db, username)
    if not user or not user.verify_password(password):
        raise HTTPException(401)
    return user

def require_user_to_be_in_org(orgid: int, cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)) -> User:
    user = get_user_from_token(db, cred.username, cred.password)
    if user.organizationid != orgid:
        raise HTTPException(403)
    return orgid

def require_user(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)) -> User: 
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.USER:
        raise HTTPException(403)
    return user

def require_lender(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)) -> User:
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.LENDER:
        raise HTTPException(403)
    return user

def require_admin(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)) -> User:
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.ADMIN:
        raise HTTPException(403)

def require_leader(cred: HTTPBasicCredentials = Depends(HTTPBasic()), db: Session = Depends(get_db)) -> User:
    user = get_user_from_token(db, cred.username, cred.password)
    if user.roleid < ROLES.LEADER:
        raise HTTPException(403)

def make_token(username: str, password: str):
    return base64.b64encode((username + ":" + password).encode("ascii")).decode("ascii")
