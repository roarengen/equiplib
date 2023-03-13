from fastapi.testclient import TestClient

def _test_role(client: TestClient) -> None:
    response = client.get("api/roles/1")
    assert response.status_code == 200

def _test_roles(client: TestClient) -> None:
    response = client.get("api/roles/")
    assert response.status_code == 200

def _test_make_role_not_possible(client: TestClient) -> None:
    response = client.post("api/roles/")
    assert response.status_code == 404
