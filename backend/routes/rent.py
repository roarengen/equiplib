from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.rent import Rent, RentCreate
import services.rentservice as crud

api = APIRouter(
    prefix="/rents",
    tags=['rents'],
)

@api.post("/", response_model=Rent)
def make_rent(rent: RentCreate, db: Session = Depends(get_db)):
    return crud.create_rent(db, rent)

@api.get("/", response_model=list[Rent])
def get_rents(db: Session = Depends(get_db)):
    return crud.get_rents(db)

@api.get("/{id}", response_model=Rent)
def get_rent(id: int, db: Session = Depends(get_db)):
    rent = crud.get_rent(db, id)
    if not rent:
        return HTTPException(status_code=404, detail="rent not found")
    return rent

@api.get("/by_org/{orgid}", response_model=list[Rent])
def get_rent_by_orgid(orgid: int, db: Session = Depends(get_db)):
    rents = crud.get_rents_by_orgid(db, orgid)
    if not rents:
        return HTTPException(status_code=404, detail="no rents not found for this org")
    return rents

@api.get("/by_user/{orgid}", response_model=list[Rent])
def get_rent_by_userid(orgid: int, db: Session = Depends(get_db)):
    rents = crud.get_rents_by_userid(db, orgid)
    if not rents:
        return HTTPException(status_code=404, detail="no rents not found for this user")
    return rents
