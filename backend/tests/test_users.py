from fastapi.testclient import TestClient

def test_user(client: TestClient) -> None:
    response = client.post("api/users/",
                           json={
                                    "firstname" : "løvblåser",
                                    "lastname" : "jens",
                                    "email" : "jens@løvblåser.com",
                                    "password" : "1234",
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )

    assert response.status_code == 200

    response = client.get("api/users/1")
    assert response.status_code == 200

def test_users(client: TestClient) -> None:
    response = client.get("api/users/")
    assert response.status_code == 200

def test_user_registration(client: TestClient) -> None:
    response = client.post("api/users/",
                           json={
                                    "firstname" : "løvblåser",
                                    "lastname" : "jens",
                                    "email" : "jens@løvblåser.com",
                                    "password" : "1234",
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )

    assert response.status_code == 200

def test_user_password_encrypted(client: TestClient) -> None:
    given_password = "1234"
    response = client.post("api/users/",
                           json={
                                    "firstname" : "løvblåser",
                                    "lastname" : "jens",
                                    "email" : "jens@løvblåser.com",
                                    "password" : f"{given_password}",
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )

    data = response.json()
    assert data['firstname'] == "løvblåser"


def test_user_registration_missing_fields(client: TestClient) -> None:
    response = client.post("api/users/",
                           json={
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )
    assert response.status_code == 422

def test_user_not_duplicate_usernames(client: TestClient) -> None:
    client.post("api/users/",
                           json={
                                    "firstname" : "løvblåser",
                                    "lastname" : "jens",
                                    "email" : "jens@løvblåser.com",
                                    "password" : "1234",
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )
    response = client.post("api/users/",
                           json={
                                    "firstname" : "løvblåser",
                                    "lastname" : "jens",
                                    "email" : "jens@løvblåser.com",
                                    "password" : "1234",
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )
    assert response.status_code == 400
