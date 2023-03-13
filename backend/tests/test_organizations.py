from fastapi.testclient import TestClient

def test_org(client: TestClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "number" : "231312131",
                                    "name" : "yoyo",
                                    "templateid" : 1
                                }
                           )
    assert response.status_code == 200
    response = client.get("api/orgs/1")
    data = response.json()

    assert response.status_code == 200
    assert data['name'] == "yoyo"

def test_orgs(client: TestClient) -> None:
    client.post("api/orgs/", json={ "number" : "231312131", "name" : "yoyo", "templateid" : 1 })
    client.post("api/orgs/", json={ "number" : "289380989", "name" : "heyhye", "templateid" : 1 })
    response = client.get("api/orgs/")
    data = response.json()
    assert response.status_code == 200
    assert len(data) == 2

def test_org_registration(client: TestClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "number" : "231312131",
                                    "name" : "yoyo",
                                    "templateid" : 1
                                }
                           )
    assert response.json()['name'] == "yoyo"
    assert response.status_code == 200

def test_org_registration_not_sufficient_fields(client: TestClient) -> None:
    response = client.post("api/orgs/",
                           json={
                                    "number" : "231312131",
                                    "templateid" : 1
                                }
                           )
    assert response.status_code == 422
