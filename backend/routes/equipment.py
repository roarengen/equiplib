from fastapi import APIRouter, HTTPException, Depends
from fastapi.logger import logger
from sqlalchemy.orm import Session
from models.tag import Tag, TagCreate
import services.equipservice as crud
from database import get_db
from models.equipment import Equipment, EquipmentCreate, EquipmentPatch
from auth import require_admin, require_user, require_lender, require_user_to_be_in_org

api = APIRouter(
    prefix="/equips",
    tags=["equips"],
    dependencies=[Depends(require_user)]
)


@api.get("/", response_model=list[Equipment], dependencies=[Depends(require_admin)])
def get_equips(db : Session = Depends(get_db)):
    return crud.get_equips(db)

@api.put("/{id}", response_model=Equipment, dependencies=[Depends(require_admin)])
def put_equipment(id: int, equipment_info: EquipmentPatch, db: Session = Depends(get_db)):
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
        logger.debug(f"requested equipment with id: {id} but was not found")
        return HTTPException(status_code=404, detail="equip not found")
    return equip

@api.post("/", response_model=Equipment, dependencies=[Depends(require_admin)])
def post_equip(equipment: EquipmentCreate, db : Session = Depends(get_db)):
    logger.info(f"new equipment created: {equipment.name}")
    return crud.create_equip(db, equipment)

@api.post("/tag", response_model=Tag, dependencies=[Depends(require_admin)])
def post_tag(tag: TagCreate, db: Session = Depends(get_db)):
    tags_in_org = crud.get_tags_by_orgid(db, tag.organizationid)
    tag_exists = any([tag.name == tag.name for tag in tags_in_org])

    if tag_exists:
        return HTTPException(400, "tag already exists")
    return crud.create_tag(db, tag)

@api.get("/tags/{orgid}", response_model=list[Tag], dependencies=[Depends(require_admin)])
def get_tags_by_orgid(orgid: int, db: Session = Depends(get_db)):
    return crud.get_tags_by_orgid(db, orgid)

@api.post("/{equipid}/addtag/{tagid}", response_model=Equipment, dependencies=[Depends(require_lender)])
def add_tag_to_equip(equipid: int, tagid:int, db: Session = Depends(get_db)):
    return crud.add_tag_to_equip(db, equipid, tagid)

@api.post("/{equipid}/rmtag/{tagid} ", response_model=Equipment, dependencies=[Depends(require_lender)])
def remove_tag_from_equip(equipid: int, tagid:int, db: Session = Depends(get_db)):
    return crud.remove_tag_from_equip(db, equipid, tagid)

