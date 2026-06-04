# SQLAlchemy column types
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

# Relationship support
from sqlalchemy.orm import relationship

# Current timestamp
from sqlalchemy.sql import func

# Base class
from app.database import Base


class TaskImage(Base):
    """
    Stores task completion images.

    One task can have many images.
    """

    __tablename__ = "task_images"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    task_id = Column(
        Integer,
        ForeignKey("tasks.id"),
        nullable=False
    )

    image_url = Column(
        String(500),
        nullable=False
    )

    public_id = Column(
        String(255),
        nullable=True
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    task = relationship(
        "Task",
        backref="images"
    )