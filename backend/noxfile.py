import os
import secrets
from pathlib import Path
from typing import Dict

import nox

VENV_DIR = Path(".venv")


@nox.session(python="3.11")
def dev(session: nox.Session) -> None:
    """
    Sets up a python development environment for the project.

    This session will:
    - Create a session virtualenv
    - Install the `virtualenv` cli tool into session virtualenv
    - Use `virtualenv` to create a project virtualenv (.venv)
    - Invoke the python interpreter from the  project virtualenv to install project dependencies.
    """

    session.install("virtualenv")
    session.run("virtualenv", os.fsdecode(VENV_DIR), silent=True)
    python = os.fsdecode(VENV_DIR.joinpath("scripts/python"))
    session.run(python, "-m", "pip", "install", "-r", "./requirements.txt", external=True)


@nox.session(python="3.11")
def start_server(session: nox.Session) -> None:
    session.install("-r", "requirements.txt")
    session.run("alembic", "upgrade", "head")

    env_vars = _get_env_vars()
    session.run("python", "-m", "uvicorn", "main:app", *session.posargs, env=env_vars)


def _get_env_vars() -> Dict[str, str]:
    env_vars = {
        "ACCESS_TOKEN_SECRET_KEY": _get_secret_key(),
    }
    var_names = ["JCRM_DB_LOGIN", "JCRM_DB_PWD", "JCRM_DB_LOCATION", "JCRM_DB_PORT"]
    for name in var_names:
        if value := os.getenv(name):
            env_vars.update({name: value})

    return env_vars


def _get_secret_key() -> str:
    if existing_secret_key := os.getenv("ACCESS_TOKEN_SECRET_KEY"):
        return existing_secret_key
    else:
        return secrets.token_hex(32)
