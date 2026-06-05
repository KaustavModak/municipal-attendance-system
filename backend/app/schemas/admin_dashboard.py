from pydantic import BaseModel


class AdminDashboardResponse(BaseModel): # For returning admin dashboard summary in API responses
    total_employees: int
    present_today: int
    late_today: int
    absent_today: int
    not_marked_today: int

    pending_tasks: int
    completed_tasks: int