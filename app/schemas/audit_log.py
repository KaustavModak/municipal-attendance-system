from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class AuditLogResponse(BaseModel): # For returning audit log data in API responses
    id: int
    admin_id: int
    action: str
    entity_type: str
    entity_id: int
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True