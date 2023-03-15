import pytest

from main import create_app, LaunchArg
from fastapi import FastAPI
from fastapi.testclient import TestClient
from database import Base, get_db

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

TEST_SQLALCHEMY_DATABASE_URL ='sqlite://'
testengine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=testengine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture()
def app():
    Base.metadata.create_all(bind=testengine)

    app = create_app(LaunchArg.TEST)
    app.dependency_overrides[get_db] = override_get_db
    yield app

    Base.metadata.drop_all(bind=testengine)


@pytest.fixture()
def client(app: FastAPI) -> TestClient:
    return TestClient(app)

