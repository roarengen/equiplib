import pytest
from main import create_app, LaunchArg, seed_database, Flask

@pytest.fixture()
def app():
    app = create_app(LaunchArg.TEST)
    app.config.update({
        "TESTING": True,
    })

    # other setup can go here
    with app.app_context():
        seed_database()

    yield app

    # clean up / reset resources here

@pytest.fixture()
def client(app: Flask):
    return app.test_client()


@pytest.fixture()
def runner(app: Flask):
    return app.test_cli_runner()
