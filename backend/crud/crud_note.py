import models
import schemas
from crud.crud_base import CRUDBase


class CRUDNote(
    CRUDBase[models.Note, schemas.Note, schemas.NoteCreate, schemas.NoteUpdate]
):
    def get_all_by_deal_id(self, db, deal_id):
        return db.query(self.model).filter(self.model.deal_id == deal_id)


crud_note = CRUDNote(models.Note)
