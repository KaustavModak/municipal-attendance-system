from pydantic import BaseModel
from datetime import datetime


class ErrorLogResponse(BaseModel):

    id: int
    route: str
    error_message: str
    created_at: datetime

    class Config:
        from_attributes = True