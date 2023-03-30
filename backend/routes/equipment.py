from fastapi import APIRouter, HTTPException, Depends
from fastapi.logger import logger
from sqlalchemy.orm import Session
import services.equipservice as crud
from database import get_db
from models.equipment import Equipment, EquipmentCreate, EquipmentPatch
from auth import require_admin, require_leader, require_user, require_lender, require_user_to_be_in_org

api = APIRouter(
    prefix="/equips",
    tags=["equips"],
    dependencies=[Depends(require_user)]
)


@api.get("/", response_model=list[Equipment], dependencies=[Depends(require_admin)])
def get_equips(db : Session = Depends(get_db)):
    return crud.get_equips(db)

@api.put("/{id}", response_model=Equipment, dependencies=[Depends(require_admin)])
def put_equipment(id: int, equipment_info: Equipment, db: Session = Depends(get_db)):
    return crud.update_equip(db, id, **equipment_info.dict())

@api.patch("/{id}", response_model=Equipment, dependencies=[Depends(require_admin)])
def patch_equipment(id: int, equipment_info: EquipmentPatch, db: Session = Depends(get_db)):
    return crud.update_equip(db, id, **equipment_info.dict())

@api.get("/by_org/{orgid}", response_model=list[Equipment], dependencies=[Depends(require_admin)])
def get_equips_by_org(orgid: int = Depends(require_user_to_be_in_org), db : Session = Depends(get_db)):
    return crud.get_equips_by_org_id(db, orgid)

@api.get("/{id}", response_model=Equipment)
def get_equip(id: int, db : Session = Depends(get_db)):
    equip = crud.get_equip(db, id)
    if not equip:
        logger.debug(f"requested equipment with id: {equip.id} but was not found")
        return HTTPException(status_code=404, detail="equip not found")
    return equip

@api.post("/", response_model=Equipment, dependencies=[Depends(require_admin)])
def post_equip(equipment: EquipmentCreate, db : Session = Depends(get_db)):
    logger.info(f"new equipment created: {equipment.name}")
    return crud.create_equip(db, equipment)

