from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    admin_id: int,
    action: str,
    entity_type: str,
    entity_id: int,
    details: str
):

    log = AuditLog(
        admin_id=admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details
    )

    db.add(log)

    db.commit()

    db.refresh(log)