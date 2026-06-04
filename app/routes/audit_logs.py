from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from typing import List

from app.database import SessionLocal

from app.models.audit_log import AuditLog

from app.schemas.audit_log import (
    AuditLogResponse
)

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get(
    "/",
    response_model=List[AuditLogResponse]
)
def get_audit_logs(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    logs = (
        db.query(AuditLog)
        .order_by(
            AuditLog.created_at.desc()
        )
        .all()
    )

    return logs