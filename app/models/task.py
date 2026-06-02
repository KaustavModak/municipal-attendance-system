# SQLAlchemy column types
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    Float,
    ForeignKey
)

# Relationship support
from sqlalchemy.orm import relationship

# Current timestamp
from sqlalchemy.sql import func

# Base class
from app.database import Base


class Task(Base):
    """
    Stores tasks assigned by admin.

    One employee can have many tasks.
    """

    __tablename__ = "tasks"

    # Primary Key
    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # Task title
    title = Column(
        String(200),
        nullable=False
    )

    # Task description
    description = Column(
        Text,
        nullable=False
    )

    # Assigned employee
    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )

    # Admin who assigned task
    assigned_by = Column(
        Integer,
        ForeignKey("admins.id"),
        nullable=False
    )

    # Assignment timestamp
    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Deadline
    deadline = Column(
        DateTime(timezone=True),
        nullable=False
    )

    # pending / completed
    status = Column(
        String(20),
        default="pending"
    )

    # Completed after deadline?
    is_late = Column(
        Boolean,
        default=False
    )

    # Completion timestamp
    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    # Completion latitude
    completion_lat = Column(
        Float,
        nullable=True
    )

    # Completion longitude
    completion_lng = Column(
        Float,
        nullable=True
    )

    # Relationship to employee
    employee = relationship(
        "Employee",
        backref="tasks"
    )