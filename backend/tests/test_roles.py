from flask.testing import FlaskClient
from extensions import db
from data import *
import json

def test_role(client: FlaskClient) -> None:
    response = client.get("api/roles/1")
    assert response.status_code == 200

def test_roles(client: FlaskClient) -> None:
    response = client.get("api/roles/")
    assert response.status_code == 200

def test_make_role_not_possible(client: FlaskClient) -> None:
    response = client.post("api/roles/")
    assert response.status_code == 404
