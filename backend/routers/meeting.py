from http import HTTPStatus
from typing import Any

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session

from backend.config import Page
from backend import schemas
from backend.db import get_db
from crud.crud_meeting import crud_meeting

router = APIRouter(prefix='/meeting', tags=['meeting'])


@router.get('/', response_model=Page[schemas.Meeting])
def get_employee_list(request: Request, db: Session = Depends(get_db)) -> Any:
    return paginate(crud_meeting.get_all(db))


@router.post('/create', response_model=schemas.Meeting, status_code=HTTPStatus.CREATED)
def create_employee(meeting: schemas.MeetingCreate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_meeting.create(db, meeting)
    except Exception as exc:
        raise HTTPException(HTTPStatus.CONFLICT, "Meeting already exists") from exc


@router.patch('/{meeting_id:int}', response_model=schemas.Meeting)
def update_employee(meeting_id: int, meeting: schemas.MeetingUpdate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_meeting.update(db, meeting_id, meeting)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Meeting with such ID") from exc


@router.delete('/{meeting_id:int}', response_model=schemas.Employee)
def delete_employee(meeting_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_meeting.delete(db, meeting_id)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Meeting with such ID") from exc
