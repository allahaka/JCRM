from typing import Generic, Optional, Type, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel as BaseSchema
from sqlalchemy.orm import Session, Query

from models import Base as DbBaseModel

DbModel = TypeVar("DbModel", bound=DbBaseModel)
BasicSchema = TypeVar("BasicSchema", bound=BaseSchema)
CreateSchema = TypeVar("CreateSchema", bound=BaseSchema)
UpdateSchema = TypeVar("UpdateSchema", bound=BaseSchema)


class CRUDBase(Generic[DbModel, BasicSchema, CreateSchema, UpdateSchema]):
    def __init__(self, model: Type[DbModel]):
        self.model = model

    def create(self, db: Session, obj: CreateSchema) -> DbModel:
        db_obj = self.model(**jsonable_encoder(obj))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, id_: int) -> Optional[DbModel]:
        return db.query(self.model).get(id_)

    def get_all(self, db: Session) -> Query:
        query = db.query(self.model)
        return query

    def update(self, db: Session, id_: int, obj: UpdateSchema) -> DbModel:
        db_obj = self.get_by_id(db, id_)
        if not db_obj:
            raise IndexNotExist

        for field, data in jsonable_encoder(obj, exclude_unset=True).items():
            setattr(db_obj, field, data)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id_: int) -> DbModel:
        obj = db.query(self.model).get(id_)
        if not obj:
            raise IndexNotExist
        db.delete(obj)
        db.commit()
        return obj

class IndexNotExist(Exception):
    pass
