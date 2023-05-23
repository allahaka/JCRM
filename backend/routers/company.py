from http import HTTPStatus
from typing import Any

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session

from backend.config import Page
from backend import schemas
from backend.db import get_db
from crud.crud_company import crud_company

router = APIRouter(prefix='/company', tags=['company'])


@router.get('/', response_model=Page[schemas.Company])
def get_company_list(request: Request, db: Session = Depends(get_db)) -> Any:
    return paginate(crud_company.get_all(db))


@router.post('/create', response_model=schemas.Company, status_code=HTTPStatus.CREATED)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_company.create(db, company)
    except Exception as exc:
        raise HTTPException(HTTPStatus.CONFLICT, "Company already exists") from exc


@router.patch('/{company_id:int}', response_model=schemas.Company)
def update_company(company_id: int, company: schemas.CompanyUpdate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_company.update(db, company_id, company)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No company with such ID") from exc


@router.delete('/{company_id:int}', response_model=schemas.Company)
def delete_company(company_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_company.delete(db, company_id)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No company with such ID") from exc