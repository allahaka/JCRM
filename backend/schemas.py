from datetime import date
from typing import Optional

from pydantic import BaseModel


class ORMBaseModel(BaseModel):
    class Config:
        orm_mode = True
        use_enum_values = True


class Company(ORMBaseModel):
    id: int
    name: str
    phone_number: str
    country: str
    last_contact: date
    business_field: str


class CompanyUpdate(ORMBaseModel):
    name: Optional[str]
    phone_number: Optional[str]
    country: Optional[str]
    last_contact: Optional[date]
    business_field: Optional[str]


class CompanyCreate(ORMBaseModel):
    name: str
    email: str
    phone_number: str
    address: str
    country: str
    last_contact: Optional[date]
    business_field: str


class Employee(ORMBaseModel):
    id: int
    name: str
    wid: str
    email: str
    phone_number: str
    address: str
    position: str
    last_contact: date
    company_id: int


class EmployeeUpdate(ORMBaseModel):
    name: Optional[str]
    wid: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    address: Optional[str]
    position: Optional[str]
    last_contact: Optional[date]
    company_id: Optional[int]


class EmployeeCreate(ORMBaseModel):
    name: str
    wid: str
    email: str
    phone_number: str
    address: str
    position: str
    last_contact: Optional[date]
    company_id: int


class Deal(ORMBaseModel):
    id: int
    name: str
    description: str
    budget: int
    currency: str
    status: str
    company_id: int
    contact_point_id: int


class DealUpdate(ORMBaseModel):
    name: Optional[str]
    description: Optional[str]
    budget: Optional[int]
    currency: Optional[str]
    status: Optional[str]
    company_id: Optional[int]
    contact_point_id: Optional[int]


class DealCreate(ORMBaseModel):
    name: str
    description: str
    budget: int
    currency: str
    status: str
    company_id: int
    contact_point_id: int


class Note(ORMBaseModel):
    id: int
    title: str
    description: str
    deal_id: int


class NoteUpdate(ORMBaseModel):
    title: Optional[str]
    description: Optional[str]
    deal_id: Optional[int]


class NoteCreate(ORMBaseModel):
    title: str
    description: str
    deal_id: int


class Meeting(ORMBaseModel):
    id: int
    title: str
    description: str
    organizer: int
    date: date
    deal_id: int


class MeetingUpdate(ORMBaseModel):
    title: Optional[str]
    description: Optional[str]
    organizer: Optional[int]
    date: Optional[date]
    deal_id: Optional[int]


class MeetingCreate(ORMBaseModel):
    title: str
    description: str
    organizer: int
    date: date
    deal_id: int
