from http import HTTPStatus
from typing import Any

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session

from backend.config import Page
from backend import schemas
from backend.db import get_db
from crud.crud_note import crud_note

router = APIRouter(prefix='/note', tags=['note'])


@router.get('/', response_model=Page[schemas.Note])
def get_note_list(request: Request, db: Session = Depends(get_db)) -> Any:
    return paginate(crud_note.get_all(db))


@router.post('/create', response_model=schemas.Note, status_code=HTTPStatus.CREATED)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_note.create(db, note)
    except Exception as exc:
        raise HTTPException(HTTPStatus.CONFLICT, "Note already exists") from exc


@router.patch('/{note_id:int}', response_model=schemas.Note)
def update_note(note_id: int, note: schemas.NoteUpdate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_note.update(db, note_id, note)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Note with such ID") from exc


@router.delete('/{note_id:int}', response_model=schemas.Note)
def delete_note(note_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_note.delete(db, note_id)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Note with such ID") from exc


@router.get('/deal/{deal_id:int}', response_model=Page[schemas.Note])
def get_note_list_by_deal_id(deal_id: int, request: Request, db: Session = Depends(get_db)) -> Any:
    try:
        return paginate(crud_note.get_all_by_deal_id(db, deal_id))
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Note with such Deal ID") from exc
