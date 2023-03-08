from typing import Any
from flask_sqlalchemy import SQLAlchemy
from flask_apispec import FlaskApiSpec
from flask_cors import CORS

import logging
from logging.handlers import SysLogHandler
import time

from collections.abc import Callable

sys_log_handler = SysLogHandler(address=('logs6.papertrailapp.com',49683)) # UNSAFE STRING THIS WILL BE ABUSED
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler = logging.FileHandler("log.log", mode="a+")
file_handler.setFormatter(formatter)
sys_log_handler.setFormatter(formatter)

logger = logging.getLogger("equiplib.sub")
docs = FlaskApiSpec()
cors = CORS()
db = SQLAlchemy()

import bcrypt

class RESPONSE_CODES:
    SUCCESS = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 403
    NOT_FOUND = 404
    SERVER_ERROR = 500

def benchmark(func: Callable[..., Any]) -> Callable[..., Any]:
    def wrapper(*args, **kwargs):
        time_start = time.time()
        value = func(args, kwargs)
        time_end = time.time()
        logger.info(f"benchmark of {func.__name__} took {(time_start - time_end):.2f}s")
        return value
    return wrapper

def encrypt(data:str) -> str:
    return bcrypt.hashpw(data.encode("utf-8"), bcrypt.gensalt(10)).decode("utf-8")

def seed_database():
    from data import User, Role, Template, Organization
    db.create_all()
    db.drop_all()
    db.create_all()
    test_temp = Template(name="default")
    test_org = Organization(organizationName="Kjell's taco", organizationNumber="1234567", templateid=1)
    boss_role = Role(name="boss", active=True)
    test_user = User(firstname="Kjell", lastname="Taco", password=encrypt("test"), username="kjelltaco", email="kjelltaco@taco.com", roleid=1, organizationid=1)
    db.session.add(test_temp)
    db.session.add(test_org)
    db.session.add(boss_role)
    db.session.add(test_user)
    db.session.commit()
