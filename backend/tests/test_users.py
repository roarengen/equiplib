from flask.testing import FlaskClient
from extensions import db
from data import *
import json

def test_user(client: FlaskClient) -> None:
    response = client.get("api/users/1")
    assert response.status_code == 200

def test_users(client: FlaskClient) -> None:
    response = client.get("api/users/")
    assert response.status_code == 200

def test_user_registration(client: FlaskClient) -> None:
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

def test_user_registration_user_in_db(client: FlaskClient) -> None:
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

def test_user_password_encrypted(client: FlaskClient) -> None:
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


def test_user_registration_missing_fields(client: FlaskClient) -> None:
    response = client.post("api/users/",
                           json={
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 1
                                }
                           )
    assert response.status_code == 400

def test_user_not_duplicate_usernames(client: FlaskClient) -> None:
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
    assert b'user with that username already exists' == response.data
    assert response.status_code == 400

def test_get_users_by_org(client: FlaskClient) -> None:
    response = client.get("api/users/by_org/1")
    users_in_org = User.query.filter(User.organizationid == 1).all()
    assert len(json.loads(response.data)) == len(users_in_org)

def test_get_users_by_org_with_multiple_orgs_and_users(client: FlaskClient) -> None:

    new_org = Organization(organizationNumber="2323423",
                           organizationName="løblåser jens'",
                           templateid=1
                           )
    db.session.add(new_org)
    db.session.commit()

    response = client.post("api/users/",
                           json={
                                    "firstname" : "løvblåser",
                                    "lastname" : "jens",
                                    "email" : "jens@løvblåser.com",
                                    "password" : "1234",
                                    "username": "jens",
                                    "roleid" : 1,
                                    "organizationid" : 2
                                }
                           )
    assert response.status_code == 200

    response = client.get("api/users/by_org/1")
    users_in_org = User.query.filter(User.organizationid == 1).all()
    assert len(json.loads(response.data)) == len(users_in_org)
    assert (len(User.query.all()) != len(json.loads(response.data)))
