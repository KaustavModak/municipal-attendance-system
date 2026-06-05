# Import SQLAlchemy column types
from sqlalchemy import Column, Integer, String, DateTime

# Used to automatically store current datetime
from sqlalchemy.sql import func

# Import Base class from database.py
from app.database import Base


class Admin(Base):
    """
    Represents the admin table.

    For now there will only be one admin
    (your father), but keeping this table
    makes the system future-proof.
    """

    # Name of MySQL table
    __tablename__ = "admins"

    # Primary Key
    id = Column(Integer, primary_key=True,autoincrement=True, index=True)

    # Admin name
    name = Column(String(100), nullable=False)

    # Phone number
    phone = Column(String(20), unique=True, nullable=False)

    # Hashed password
    password_hash = Column(String(255), nullable=False)

    # Creation timestamp
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )