from fastapi.testclient import TestClient

def test_make_and_get_equip(client: TestClient) -> None:
    response = client.post("api/equips/",
                json={
                    "organizationid" : 1,
                    "locationid" : 1,
                    "name" : "banandress"
                })
    assert response.status_code == 200
    response = client.get("api/equips/1")
    assert response.status_code == 200

def test_post_equips(client: TestClient) -> None:
    response = client.post("api/equips/",
                           json={
                               "organizationid" : 1,
                               "locationid" : 1,
                               "name" : "banandress"
                           })
    assert response.status_code == 200

def test_post_equips_many(client: TestClient) -> None:
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

def test_post_equips_many_inactive(client: TestClient) -> None:
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

