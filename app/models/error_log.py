from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database import Base


class ErrorLog(Base):

    __tablename__ = "error_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    route = Column(
        String(255),
        nullable=False
    )

    error_message = Column(
        String(1000),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )