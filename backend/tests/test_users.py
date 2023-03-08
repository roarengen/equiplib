from flask.testing import FlaskClient
from extensions import db
from data.user import User

def test_user(client: FlaskClient):
    response = client.get("api/users/1")
    assert response.status_code == 200

def test_users(client: FlaskClient):
    response = client.get("api/users/")
    assert response.status_code == 200

def test_user_registration(client: FlaskClient):
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

def test_user_registration_user_in_db(client: FlaskClient):
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
    
    response = client.get("api/users/2")
    assert len(User.query.all()) == 2
    assert response.status_code == 200

def test_user_password_encrypted(client: FlaskClient):
    given_password = "1234"
    client.post("api/users/", 
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
    new_user = User.query.all()[1]

    assert new_user.password != given_password
    assert new_user.firstname == "løvblåser"