import models
import schemas
from crud.crud_base import CRUDBase


class CRUDCompany(
    CRUDBase[models.Company, schemas.Company, schemas.CompanyCreate, schemas.CompanyUpdate]
):
    pass


crud_company = CRUDCompany(models.Company)
