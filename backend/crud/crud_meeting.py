import models
import schemas
from crud.crud_base import CRUDBase


class CRUDMeeting(
    CRUDBase[models.Meeting, schemas.Meeting, schemas.MeetingCreate, schemas.MeetingUpdate]
):
    pass


crud_meeting = CRUDMeeting(models.Meeting)
