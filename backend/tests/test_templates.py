from flask.testing import FlaskClient
from extensions import db
from data import *
import json

def test_temp(client: FlaskClient) -> None:
    response = client.get("api/temps/1")
    assert response.status_code == 200

def test_temps(client: FlaskClient) -> None:
    response = client.get("api/temps/")
    assert response.status_code == 200

def test_temp_registration(client: FlaskClient) -> None:
    response = client.post("api/temps/",
                           json={
                                    "userComment" : "smarty",
                                    "name" : "not default"
                                }
                           )
    test_org = Template.query.filter(Template.name == "not default").first()
    assert test_org
    assert response.status_code == 201
