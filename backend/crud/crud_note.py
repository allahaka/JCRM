import models
import schemas
from crud.crud_base import CRUDBase


class CRUDNote(
    CRUDBase[models.Note, schemas.Note, schemas.NoteCreate, schemas.NoteUpdate]
):
    pass


crud_note = CRUDNote(models.Note)
