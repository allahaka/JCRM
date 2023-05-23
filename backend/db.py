import os
from typing import Generator

from fastapi.security import OAuth2PasswordBearer
from requests import Session
from sqlalchemy import Engine, create_engine

from sqlalchemy.orm import sessionmaker


oauth2_scheme = OAuth2PasswordBearer("tokens/")

DEFAULT_DB_LOCATION = "127.0.0.1"
DEFAULT_DB_PORT = "3306"


def get_engine() -> Engine:
    location = os.getenv("JCRM_DB_LOCATION", DEFAULT_DB_LOCATION)
    port = os.getenv("JCRM_DB_PORT", DEFAULT_DB_PORT)
    login = os.getenv("JCRM_DB_LOGIN")
    password = os.getenv("JCRM_DB_PWD")
    name = "jcrm-test" if os.getenv("TESTING") == "1" else "jcrm"

    if not login or not password:
        raise ValueError("Database credentials not provided.")

    connection_string = f"mysql+pymysql://{login}:{password}@{location}:{port}/{name}"
    return create_engine(connection_string, pool_pre_ping=True)


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
