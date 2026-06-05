# SQLAlchemy column types
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

# Timestamp support
from sqlalchemy.sql import func

# Relationship support
from sqlalchemy.orm import relationship

# Base class
from app.database import Base


class Employee(Base):
    """
    Represents municipal employees.

    Every employee belongs to exactly one office.
    """

    __tablename__ = "employees"

    # Primary key
    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # Employee name
    name = Column(
        String(100),
        nullable=False
    )

    # Unique phone number
    phone = Column(
        String(20),
        unique=True,
        nullable=False
    )

    # Password hash
    password_hash = Column(
        String(255),
        nullable=False
    )

    # Foreign Key to offices table
    office_id = Column(
        Integer,
        ForeignKey("offices.id"),
        nullable=False
    )

    # Employee status
    status = Column(
        String(20),
        default="active"
    )

    # Creation timestamp
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationship with Office
    office = relationship(
        "Office",
        backref="employees"
    )
    # backref : creates a reverse relationship, allowing us to access the office of an employee and also all employees of an office easily.