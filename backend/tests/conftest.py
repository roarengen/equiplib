import database
import pytest

from main import create_app, LaunchArg
from fastapi import FastAPI
from fastapi.testclient import TestClient

from database import TestingSessionLocal

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture()
def app():
    database.Base.metadata.create_all(bind=database.testengine)

    app = create_app(LaunchArg.TEST)
    app.dependency_overrides[database.get_db] = override_get_db
    yield app

    database.Base.metadata.drop_all(database.testengine)


@pytest.fixture()
def client(app: FastAPI) -> TestClient:
    return TestClient(app)

