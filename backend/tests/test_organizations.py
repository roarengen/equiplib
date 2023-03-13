from fastapi.testclient import TestClient
import json

def test_org(client: TestClient) -> None:
    response = client.get("api/orgs/1")
    assert response.status_code == 200

def test_orgs(client: TestClient) -> None:
    response = client.get("api/orgs/")
    assert response.status_code == 200

def test_org_registration(client: TestClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "number" : "231312131",
                                    "name" : "yoyo",
                                    "templateid" : 1
                                }
                           )
    test_org = Organization.query.filter(Organization.name == "yoyo").first()
    assert test_org
    assert response.status_code == 201

def test_org_registration_not_sufficient_fields(client: TestClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "number" : "231312131",
                                    "templateid" : 1
                                }
                           )
    assert response.status_code == 400
