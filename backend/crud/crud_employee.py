from sqlalchemy.orm import Session, Query

import models
import schemas
from crud.crud_base import CRUDBase


class CRUDEmployee(
    CRUDBase[models.Employee, schemas.Employee, schemas.EmployeeCreate, schemas.EmployeeUpdate]
):
    def get_all(self, db: Session) -> Query:
        query = db.query(self.model.id.label('id'),
                         self.model.name.label('name'),
                         self.model.wid.label('wid'),
                         self.model.email.label('email'),
                         self.model.phone_number.label('phone_number'),
                         self.model.address.label('address'),
                         self.model.position.label('position'),
                         self.model.company_id.label('company_id'),
                         models.Company.name.label('company_name')).join(models.Company)
        return query


crud_employee = CRUDEmployee(models.Employee)
