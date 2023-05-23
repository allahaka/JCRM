from http import HTTPStatus
from typing import Any

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import Session

from backend.config import Page
from backend import schemas
from backend.db import get_db
from crud.crud_deal import crud_deal

router = APIRouter(prefix='/deal', tags=['deal'])


@router.get('/', response_model=Page[schemas.Deal])
def get_deal_list(request: Request, db: Session = Depends(get_db)) -> Any:
    return paginate(crud_deal.get_all(db))


@router.post('/create', response_model=schemas.Deal, status_code=HTTPStatus.CREATED)
def create_deal(deal: schemas.DealCreate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_deal.create(db, deal)
    except Exception as exc:
        raise HTTPException(HTTPStatus.CONFLICT, "Deal already exists") from exc


@router.patch('/{deal_id:int}', response_model=schemas.Deal)
def update_deal(deal_id: int, deal: schemas.DealUpdate, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_deal.update(db, deal_id, deal)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Deal with such ID") from exc


@router.delete('/{deal_id:int}', response_model=schemas.Deal)
def delete_deal(deal_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        return crud_deal.delete(db, deal_id)
    except Exception as exc:
        raise HTTPException(HTTPStatus.NOT_FOUND, "No Deal with such ID") from exc
