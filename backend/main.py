from enum import Enum, auto
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from blueprints import api
import database

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

class LaunchArg(Enum):
    TEST = auto()
    DEV = auto()
    PRD = auto()

def create_app() -> FastAPI:
    database.Base.metadata.create_all(bind=database.engine)
    app = FastAPI(title="equiplib")
    app.include_router(api)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


if __name__ == "__main__":
    pass
    #app = create_app(LaunchArg.DEV)
    #seed_database(app)  # UNCOMMENT THIS TO RESERVE STATE
    #app.run("localhost", 8888, True)
