# SQLAlchemy column types
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    Time,
    DateTime,
    Boolean,
    ForeignKey
)

# Relationship support
from sqlalchemy.orm import relationship

# Current timestamp
from sqlalchemy.sql import func

# Base class
from app.database import Base


class Attendance(Base):
    """
    Stores daily attendance records.

    One employee can have many attendance records.
    """

    __tablename__ = "attendance"

    # Primary Key
    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # Employee Foreign Key
    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )

    # Attendance date
    date = Column(
        Date,
        nullable=False
    )

    # Attendance time
    time = Column(
        Time,
        nullable=False
    )

    # present / late / absent
    status = Column(
        String(20),
        nullable=False
    )

    # GPS latitude
    latitude = Column(
        Float,
        nullable=False
    )

    # GPS longitude
    longitude = Column(
        Float,
        nullable=False
    )

    # Cloudinary selfie URL
    selfie_url = Column(
        String(500),
        nullable=False
    )

    # Did admin mark attendance manually?
    manual_marked = Column(
        Boolean,
        default=False
    )

    # If admin edits attendance
    updated_by_admin = Column(
        Boolean,
        default=False
    )

    # Last update time
    updated_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    # Record creation time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationship to employee
    employee = relationship(
        "Employee",
        backref="attendance_records"
    )