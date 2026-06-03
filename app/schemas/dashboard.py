from pydantic import BaseModel


class DashboardResponse(BaseModel): # For returning employee dashboard summary in API responses
    today_attendance: str
    pending_tasks: int
    completed_tasks: int
    late_tasks: int