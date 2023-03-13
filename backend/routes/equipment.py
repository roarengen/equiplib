from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import services.equipservice as crud
from database import get_db
from models.equipment import Equipment, EquipmentCreate

api = APIRouter(prefix="/equips")

@api.get("/", response_model=list[Equipment])
def get_equips(db : Session = Depends(get_db)):
    return crud.get_equips(db)

@api.get("/<int:id>", response_model=Equipment)
def get_equip(id: int, db : Session = Depends(get_db)):
    equip = crud.get_equip(db, id)
    if not equip:
        return HTTPException(status_code=404, detail="equip not found")
    return equip

@api.post("/", response_model=Equipment)
def post_equip(org: EquipmentCreate, db : Session = Depends(get_db)):
    return crud.create_equip(db, org)

