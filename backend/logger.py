from logging.handlers import SysLogHandler
import logging

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

handlers = list(filter(lambda x: x != None, [file_handler, sys_log_handler]))