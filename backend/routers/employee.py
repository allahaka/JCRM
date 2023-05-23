from http import HTTPStatus
from typing import Any

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session

from backend.config import Page
from backend import schemas
from backend.db import get_db
from crud.crud_employee import crud_employee

router = APIRouter(prefix='/employee', tags=['employee'])


@router.get('/', response_model=Page[schemas.Employee])
def get_employee_list(request: Request, db: Session = Depends(get_db)) -> Any:
    return paginate(crud_employee.get_all(db))


@router.post('/create', response_model=schemas.Employee, status_code=HTTPStatus.CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_employee.create(db, employee)
    except Exception as exc:
        raise HTTPException(HTTPStatus.CONFLICT, "Employee already exists") from exc


@router.patch('/{employee_id:int}', response_model=schemas.Employee)
def update_employee(employee_id: int, employee: schemas.EmployeeUpdate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_employee.update(db, employee_id, employee)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Employee with such ID") from exc


@router.delete('/{employee_id:int}', response_model=schemas.Employee)
def delete_employee(employee_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_employee.delete(db, employee_id)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Employee with such ID") from exc
