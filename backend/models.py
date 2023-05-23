from typing import Dict

from sqlalchemy import MetaData, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql.functions import now

metadata = MetaData()
Base = declarative_base(metadata=metadata)


class Company(Base):
    __tablename__ = "company"
    __versioned__: Dict = {}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    address = Column(String(50), unique=False, nullable=False)
    country = Column(String(50), unique=False, nullable=False)
    last_contact = Column(Date, nullable=False, default=now())
    business_field = Column(String(50), unique=False, nullable=False)

    employees = relationship("Employee", back_populates="company")
    deals = relationship("Deal", back_populates="company")


class Employee(Base):
    __tablename__ = "employee"
    __versioned__: Dict = {}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    wid = Column(String(50), unique=True, nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    address = Column(String(50), unique=False, nullable=False)
    position = Column(String(50), unique=False, nullable=False)
    last_contact = Column(Date, nullable=False, default=now())
    company_id = Column(Integer, ForeignKey('company.id'), nullable=False)

    company = relationship("Company", back_populates="employees")
    deals = relationship("Deal", back_populates="contact_point")


class Deal(Base):
    __tablename__ = "deal"
    __versioned__: Dict = {}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(50), unique=True, nullable=False)
    budget = Column(Integer, unique=False, nullable=False)
    currency = Column(String(50), unique=False, nullable=False)
    status = Column(String(50), unique=False, nullable=False)
    company_id = Column(Integer, ForeignKey('company.id'), nullable=False)
    contact_point_id = Column(Integer, ForeignKey('employee.id'), nullable=False)

    company = relationship("Company", back_populates="deals")
    contact_point = relationship("Employee", back_populates="deals")
    notes = relationship("Note", back_populates="deal")
    meetings = relationship("Meeting", back_populates="deal")


class Note(Base):
    __tablename__ = "note"
    __versioned__: Dict = {}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), unique=True, nullable=False)
    description = Column(String(50), unique=True, nullable=False)
    deal_id = Column(Integer, ForeignKey('deal.id'), nullable=False)

    deal = relationship("Deal", back_populates="notes")


class Meeting(Base):
    __tablename__ = "meeting"
    __versioned__: Dict = {}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), unique=True, nullable=False)
    description = Column(String(50), nullable=False)
    organizer = Column(Integer, ForeignKey('employee.id'), nullable=False)
    date = Column(Date, nullable=False, default=now())
    deal_id = Column(Integer, ForeignKey('deal.id'), nullable=False)

    deal = relationship("Deal", back_populates="meetings")
