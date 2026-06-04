from pydantic import BaseModel


class ReportDateResponse(BaseModel):
    date: str