from flask.testing import FlaskClient
from extensions import db
from data import *
import json
import time

def test_rent(client: FlaskClient) -> None:
    test_id = 1
    response = client.get(f"api/rents/{test_id}")
    rent = json.loads(response.data)
    assert rent['rentedFromDate'] == Rent.query.filter(Rent.id == test_id).first().rentedFromDate
    assert response.status_code == 200

def test_rents(client: FlaskClient) -> None:
    response = client.get("api/rents/")
    assert response.status_code == 403
    assert response.data == b"illegal endpoint"

def test_rents_by_org(client: FlaskClient) -> None:
    orgid = 1
    new_equip = Equipment(
        organizationid = orgid,
        name="fishing rod",
        locationid=1,
        active=True
    )

    new_rent = Rent(
        userid=1,
        equipmentid=1,
        rentedFromDate=time.time(),
        comment="lost his while fishing, sadge"
    )

    db.session.add(new_equip)
    db.session.add(new_rent)
    db.session.commit()

    response = client.get(f"api/rents/by_org/{orgid}")

    assert response.status_code == 403
