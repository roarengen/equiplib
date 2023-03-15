from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from database import get_db
from models.location import Location, LocationCreate
import services.locationservice as crud

api = APIRouter(
    prefix="/location",
    tags=["location"],
)

@api.get("/", response_model=list[Location])
def get_locs(db: Session = Depends(get_db)):
    return crud.get_locations(db)

@api.get("/{id}", response_model=Location)
def get_loc(id: int, db: Session = Depends(get_db)):
    loc = crud.get_location(db, id)
    if not loc:
        logger.debug(f"location requesed with id: {id} but was not found")
        HTTPException(status_code=404, detail="location not found")
    return loc


@api.get("/by_org/{orgid}", response_model=list[Location])
def get_loc_by_org_id(orgid: int, db: Session = Depends(get_db)):
    locs = crud.get_locations_by_orgid(db, orgid)
    if not locs:
        logger.debug(f"locations requesed with orgid: {orgid} but was not found")
        HTTPException(status_code=404, detail=f"no locations found on org with id: {orgid}")
    return locs

@api.post("/", response_model=list[Location])
def post_location(location: LocationCreate, db: Session = Depends(get_db)):
    logger.info(f"{location} has been created")
    return crud.create_location(db, location)

@api.get("/{id}/disable", response_model=list[Location])
def disable(id: int, db: Session = Depends(get_db)):
    logger.info(f"{id} has been disabled")
    return crud.disable_location(db, id)
