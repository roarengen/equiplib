from fastapi import APIRouter, HTTPException, Depends
from fastapi.logger import logger
from sqlalchemy.orm import Session
import services.equipservice as crud
from database import get_db
from models.equipment import Equipment, EquipmentCreate

api = APIRouter(
    prefix="/equips",
    tags=["equips"]
)

@api.get("/", response_model=list[Equipment])
def get_equips(db : Session = Depends(get_db)):
    return crud.get_equips(db)

@api.get("/by_org/{orgid}", response_model=list[Equipment])
def get_equips_by_org(orgid: int, db : Session = Depends(get_db)):
    return crud.get_equips_by_org_id(db, orgid)

@api.get("/{id}", response_model=Equipment)
def get_equip(id: int, db : Session = Depends(get_db)):
    equip = crud.get_equip(db, id)
    if not equip:
        logger.debug(f"requested equipment with id: {equip.id} but was not found")
        return HTTPException(status_code=404, detail="equip not found")
    return equip

@api.post("/", response_model=Equipment)
def post_equip(equipment: EquipmentCreate, db : Session = Depends(get_db)):
    logger.info(f"new equipment created: {equipment.name}")
    return crud.create_equip(db, equipment)

