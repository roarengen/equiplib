import bcrypt
from typing import Any

import logging
from logging.handlers import SysLogHandler
import time
from datetime import datetime

from collections.abc import Callable

formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler = logging.FileHandler("log.log", mode="a+")
file_handler.setFormatter(formatter)
try:
    import secret
    sys_log_handler = SysLogHandler(address=secret.SYSLOG_ADDRESS)
    sys_log_handler.setFormatter(formatter)
except:
    sys_log_handler = None


class RESPONSE_CODES:
    SUCCESS = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 403
    NOT_FOUND = 404
    SERVER_ERROR = 500

def encrypt(data: str) -> str:
    return bcrypt.hashpw(data.encode("utf-8"), bcrypt.gensalt(10)).decode("utf-8")


def datetime_from_string(datetime_string: str) -> datetime:
    return datetime.strptime(datetime_string, "%a, %d %b %Y %H:%M:%S %Z")
