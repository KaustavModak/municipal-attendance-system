from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from typing import List

from app.database import SessionLocal

from app.models.error_log import ErrorLog

from app.schemas.error_log import (
    ErrorLogResponse
)

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/error-logs",
    tags=["Error Logs"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get(
    "/",
    response_model=List[ErrorLogResponse]
)
def get_error_logs(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    View application errors.
    """

    logs = (
        db.query(ErrorLog)
        .order_by(
            ErrorLog.created_at.desc()
        )
        .all()
    )

    return logs