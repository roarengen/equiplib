from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from database import get_db
from models.rent import Rent, RentCreate, RentReturn
from models.user import User
import services.rentservice as crud
from extensions import ROLES
from auth import require_user_to_be_in_org, require_user, require_lender, require_admin

api = APIRouter(
    prefix="/rents",
    tags=['rents'],
)

@api.post("/", response_model=Rent, dependencies=[Depends(require_lender)])
def make_rent(rent: RentCreate, db: Session = Depends(get_db)):
    return crud.create_rent(db, rent)

@api.get("/current/{orgid}", response_model=list[Rent], dependencies=[Depends(require_admin)])
def get_currently_rented(orgid: int, db: Session = Depends(get_db)):
    rents = crud.get_rents_by_orgid(db, orgid)
    if rents:
        return list(filter(lambda x: x.rentedToDate == None,rents))

@api.get("/", response_model=list[Rent], dependencies=[Depends(require_admin)])
def get_rents(db: Session = Depends(get_db)):
    return crud.get_rents(db)

@api.get("/{id}", response_model=Rent, dependencies=[Depends(require_user)])
def get_rent(id: int, db: Session = Depends(get_db)):
    rent = crud.get_rent(db, id)
    if not rent:
        logger.debug(f"requested rent with id: {id} but no rents where found")
        return HTTPException(status_code=404, detail="rent not found")
    return rent

@api.get("/by_org/{orgid}", response_model=list[Rent], dependencies = [Depends(require_lender)])
def get_rent_by_orgid(orgid: int = Depends(require_user_to_be_in_org), db: Session = Depends(get_db)):
    rents = crud.get_rents_by_orgid(db, orgid)
    if not rents:
        logger.debug(f"requested rents for org: {orgid} but no rents where found")
        return HTTPException(status_code=404, detail="no rents not found for this org")
    return rents

@api.get("/me", response_model=list[Rent])
def get_my_rents(db: Session = Depends(get_db), user : User = Depends(require_user)):
    return crud.get_rents_by_userid(db, user.id)

@api.get("/by_user/{userid}", response_model=list[Rent])
def get_rents_by_userid(userid: int, db: Session = Depends(get_db), user = Depends(require_user)):
    rents = crud.get_rents_by_userid(db, userid)
    if not rents:
        logger.debug(f"requested rents for user: {userid} but no rents where found")
        return HTTPException(status_code=404, detail="no rents not found for this user")
    if user.roleid < ROLES.ADMIN:
        if user.id != userid:
            return HTTPException(status_code=401, detail="no rents not found for this user")
    return rents

@api.post("/return", response_model=list[Rent])
def return_rent(return_rent: RentReturn, db: Session = Depends(get_db), user = Depends(require_user)):
    rent = crud.return_rent(db,
                     return_rent.id,
                     return_rent.locationid,
                     return_rent.userid,
                     )
    if not rent:
        HTTPException(404, "rent not found")

    return rent

