from sqlalchemy.orm import Session, Query

import models
import schemas
from crud.crud_base import CRUDBase


class CRUDDeal(
    CRUDBase[models.Deal, schemas.Deal, schemas.DealCreate, schemas.DealUpdate]
):
    def get_all(self, db: Session) -> Query:
        query = db.query(self.model.id.label('id'),
                         self.model.name.label('name'),
                         self.model.description.label('description'),
                         self.model.budget.label('budget'),
                         self.model.currency.label('currency'),
                         self.model.status.label('status'),
                         self.model.company_id.label('company_id'),
                         self.model.contact_point_id.label('contact_point_id'),
                         models.Company.name.label('company_name'),
                         models.Employee.name.label('contact_point_name'))\
            .select_from(self.model)\
            .join(models.Company, self.model.company_id == models.Company.id)\
            .join(models.Employee, self.model.contact_point_id == models.Employee.id)
        return query


crud_deal = CRUDDeal(models.Deal)
