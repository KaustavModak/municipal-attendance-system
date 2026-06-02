# SQLAlchemy column types
from sqlalchemy import Column, Integer, String, Float, DateTime

# Current timestamp
from sqlalchemy.sql import func

# Base class
from app.database import Base


class Office(Base):
    """
    Represents an office location.

    Every employee belongs to exactly one office.

    Example:
    Ward Office 1
    Ward Office 2
    Market Office
    """

    __tablename__ = "offices"

    # Primary key
    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # Office name
    office_name = Column(
        String(100),
        nullable=False
    )

    # GPS Latitude
    latitude = Column(
        Float,
        nullable=False
    )

    # GPS Longitude
    longitude = Column(
        Float,
        nullable=False
    )

    # Attendance radius
    radius_meters = Column(
        Integer,
        nullable=False,
        default=100
    )

    # Creation time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )