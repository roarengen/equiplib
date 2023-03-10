from flask.testing import FlaskClient
from extensions import db
from data import *
import json

def test_get_equip(client: FlaskClient) -> None:
    db.session.add(
        Equipment(
            organizationid=1,
            locationid=1,
            name="test equipment",
            active=True
                  )
    )
    db.session.commit()
    response = client.get("api/equips/1")
    assert response.status_code == 200

def test_get_equips(client: FlaskClient) -> None:
    response = client.get("api/equips/")
    assert response.status_code == 403

def test_post_equips(client: FlaskClient) -> None:
    response = client.post("api/equips/",
                           json={
                               "organizationid" : 1,
                               "locationid" : 1,
                               "name" : "banandress"
                           })
    assert Equipment.query.filter(Equipment.name == "banandress").first()
    assert response.status_code == 201

def test_post_equips_many(client: FlaskClient) -> None:
    client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "banandress"
                })
    client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "cola-glass fra 2011"
                })
    client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "løvblåser"
                })
    assert len(Equipment.query.all()) == 3

def test_post_equips_many_inactive(client: FlaskClient) -> None:
    client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "banandress",
                    "active": False
                })
    client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "kjell-e-dress"
                })
    client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "tacokrydder"
                })
    assert len(Equipment.query.all()) == 3
    assert not Equipment.query.filter_by(name="banandress").first().active

def test_get_equips_by_orgid(client: FlaskClient) -> None:
    orgid = 1

    test_org = Organization(
        number="21312313",
        name="different organization",
        templateid=1
    )
    db.session.add(test_org)
    db.session.commit()
    test_org_id = 2

    client.post("api/equips/",
                           json={
                               "organizationid" : test_org_id,
                               "locationid" : 1,
                               "name" : "banandress"
                           })
    client.post("api/equips/",
                           json={
                               "organizationid" : orgid,
                               "locationid" : 1,
                               "name" : "melkeglass"
                           })
    client.post("api/equips/",
                           json={
                               "organizationid" : orgid,
                               "locationid" : 1,
                               "name" : "kaktuspotte"
                           })
    response = client.get(f"api/equips/by_org/{orgid}")
    assert len(json.loads(response.data)) == 2
    assert response.status_code == 200


