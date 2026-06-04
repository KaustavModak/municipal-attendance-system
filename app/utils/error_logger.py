from sqlalchemy.orm import Session
from app.models.error_log import ErrorLog

def create_error_log(
    db: Session,
    route: str,
    error_message: str
):
    error = ErrorLog(
        route=route,
        error_message=error_message
    )

    db.add(error)
    db.commit()
    db.refresh(error)