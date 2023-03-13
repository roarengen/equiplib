from dateutil import parser
from fastapi.testclient import TestClient
from models.equipment import EquipmentCreate

eq = EquipmentCreate(organizationid=0, name="tacokrus", locationid=0)
rent = {
    "userid": 1,
    "equipmentid": 1,
    "rentedFromDate": "2023-03-13T21:16:14.416Z",
}
def test_rent(client: TestClient) -> None:
    response = client.post("/api/equips",
                           json=eq.dict())
    assert response.status_code == 200

    response = client.post("/api/rents",
                           json=rent)
    assert response.status_code == 200

    response = client.get("/api/rents/1")
    assert response.status_code == 200

    data = response.json()
    assert response.status_code == 200
    assert parser.parse(data['rentedFromDate']).date() == parser.parse(rent['rentedFromDate']).date()

def test_rents(client: TestClient) -> None:
    response = client.get("api/rents/")
    assert response.status_code == 200
