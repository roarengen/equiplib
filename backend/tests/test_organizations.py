from flask.testing import FlaskClient
from extensions import db
from data import *
import json

def test_org(client: FlaskClient) -> None:
    response = client.get("api/orgs/1")
    assert response.status_code == 200

def test_orgs(client: FlaskClient) -> None:
    response = client.get("api/orgs/")
    assert response.status_code == 200

def test_org_registration(client: FlaskClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "organizationNumber" : "231312131",
                                    "organizationName" : "yoyo",
                                    "templateid" : 1
                                }
                           )
    test_org = Organization.query.filter(Organization.organizationName == "yoyo").first()
    assert test_org
    assert response.status_code == 201

def test_org_registration_not_sufficient_fields(client: FlaskClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "organizationNumber" : "231312131",
                                    "templateid" : 1
                                }
                           )
    assert response.status_code == 400
