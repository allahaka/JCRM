import models
import schemas
from crud.crud_base import CRUDBase


class CRUDEmployee(
    CRUDBase[models.Employee, schemas.Employee, schemas.EmployeeCreate, schemas.EmployeeUpdate]
):
    pass


crud_employee = CRUDEmployee(models.Employee)
