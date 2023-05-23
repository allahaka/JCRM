import models
import schemas
from crud.crud_base import CRUDBase


class CRUDDeal(
    CRUDBase[models.Deal, schemas.Deal, schemas.DealCreate, schemas.DealUpdate]
):
    pass


crud_deal = CRUDDeal(models.Deal)
