from enum import Enum, auto
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api
import database
import uvicorn

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

def create_app(arg : LaunchArg) -> FastAPI:
    if arg == LaunchArg.DEV or arg == LaunchArg.PRD:
        database.Base.metadata.create_all(bind=database.engine)
    elif arg == LaunchArg.TEST:
        pass
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
    app = create_app(LaunchArg.DEV)
    uvicorn.run(app)
