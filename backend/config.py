from datetime import timedelta
from typing import Generic, TypeVar

from fastapi import Query
from fastapi_pagination.default import Page as BasePage
from fastapi_pagination.default import Params as BaseParams
from pydantic import BaseSettings

T = TypeVar("T")


class Settings(BaseSettings):
    ACCESS_TOKEN_EXPIRE_DELTA = timedelta(minutes=360)


class PaginationParams(BaseParams):
    size: int = Query(25, ge=1, le=1_000, description="Page size")


class Page(BasePage[T], Generic[T]):
    __params_type__ = PaginationParams


settings = Settings()
