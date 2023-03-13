from fastapi.testclient import TestClient

def _test_temp(client: TestClient) -> None:
    response = client.get("api/temps/1")
    assert response.status_code == 200

def _test_temps(client: TestClient) -> None:
    response = client.get("api/temps/")
    assert response.status_code == 200

def _test_temp_registration(client: TestClient) -> None:
    response = client.post("api/temps/",
                           json={
                                    "userComment" : "smarty",
                                    "name" : "not default"
                                }
                           )
    assert response.status_code == 201
