from backend.models.location import Location
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
        raise HTTPException(status_code=404, detail="equip not found")
    return equip

@api.post("/", response_model=Equipment, dependencies=[Depends(require_admin)])
def post_equip(equipment: EquipmentCreate, db : Session = Depends(get_db)):
    #any([equipment.name == eq.name for eq in crud.get_equips_by_org_id(db, equipment.organizationid)])

    all_equips = crud.get_equips_by_org_id(db, equipment.organizationid)
    name_already_exists = any([equipment.name == eq.name for eq in all_equips])

    if name_already_exists:
        logger.info(f"equipment name already exists: {equipment.name}")
        raise HTTPException(400, "equipment already exists with that name")

    logger.info(f"new equipment created: {equipment.name}")
    return crud.create_equip(db, equipment)

@api.post("/tag", response_model=Tag, dependencies=[Depends(require_admin)])
def post_tag(tag: TagCreate, db: Session = Depends(get_db)):
    tags_in_org = crud.get_tags_by_orgid(db, tag.organizationid)
    tag_exists = any([tag.name == tag_.name for tag_ in tags_in_org])

    if tag_exists:
        raise HTTPException(400, "tag already exists")
    return crud.create_tag(db, tag)

@api.get("/tag/{tagid}/disable", response_model=Tag, dependencies=[Depends(require_admin)])
def disable_tag(tagid: int, db: Session = Depends(get_db)):
    tag = crud.disable_tag(db, tagid)
    if not tag:
        return HTTPException(404, "tag not found")
    
    return tag

@api.get("/getlocation/{equipid}", response_model=Location, dependencies=[Depends(require_user_to_be_in_org)])
def get_location_for_equipment(equipid: int, db: Session = Depends(get_db)):
    equip = crud.get_location_by_equipid(db, equipid)
    if not equip:
        return HTTPException(404, "location not found")
    
    return equip

@api.get("/tag/{tagid}/enable", response_model=Tag, dependencies=[Depends(require_admin)])
def enable_tag(tagid: int, db: Session = Depends(get_db)):
    tag = crud.enable_tag(db, tagid)
    if not tag:
        return HTTPException(404, "tag not found")
    
    return tag

@api.get("/tags/{orgid}", response_model=list[Tag], dependencies=[Depends(require_admin)])
def get_tags_by_orgid(orgid: int, db: Session = Depends(get_db)):
    return crud.get_tags_by_orgid(db, orgid)

@api.post("/{equipid}/addtag/{tagid}", response_model=Equipment, dependencies=[Depends(require_lender)])
def add_tag_to_equip(equipid: int, tagid:int, db: Session = Depends(get_db)):
    return crud.add_tag_to_equip(db, equipid, tagid)

@api.post("/{equipid}/rmtag/{tagid} ", response_model=Equipment, dependencies=[Depends(require_lender)])
def remove_tag_from_equip(equipid: int, tagid:int, db: Session = Depends(get_db)):
    return crud.remove_tag_from_equip(db, equipid, tagid)

@api.patch("/tag/{id}", response_model=Tag, dependencies=[Depends(require_admin)])
def patch_tag(id: int, tag: Tag, db: Session = Depends(get_db)):
    return crud.update_tag(db, id, **tag.dict())

@api.patch("/{id}/addtags", response_model=Equipment, dependencies=[Depends(require_admin)])
def add_tags_to_equip(id: int, tagids: list[int], db: Session = Depends(get_db)):
    equipment = crud.get_equip(db, id)
    if not equipment:
        return HTTPException(404)
    tags = crud.get_tags_by_orgid(db, equipment.organizationid)
    tags_to_add = []
    if tags and tagids:
        for tagid in tagids:
            for tag in tags:
                if tag.id == tagid:
                    tags_to_add.append(tag)


    equipment.tags = []
    db.commit()
    db.refresh(equipment)
    for tag in list(set(tags_to_add)):
        equipment.tags.append(tag)
        db.commit()
        db.refresh(equipment)

    return equipment

