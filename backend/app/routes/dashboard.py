from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from datetime import datetime
import pytz

from app.database import SessionLocal

from app.models.attendance import Attendance
from app.models.task import Task

from app.schemas.dashboard import DashboardResponse

from app.utils.dependencies import (
    get_current_employee
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get(
    "/",
    response_model=DashboardResponse
)
def employee_dashboard(
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Employee dashboard summary.
    """

    india_timezone = pytz.timezone(
        "Asia/Kolkata"
    )

    today = datetime.now(
        india_timezone
    ).date()

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee_id,
            Attendance.date == today
        )
        .first()
    )

    if attendance:
        today_status = attendance.status
    else:
        today_status = "not_marked"

    pending_tasks = (
        db.query(Task)
        .filter(
            Task.employee_id == employee_id,
            Task.status == "pending"
        )
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .filter(
            Task.employee_id == employee_id,
            Task.status == "completed"
        )
        .count()
    )

    late_tasks = (
        db.query(Task)
        .filter(
            Task.employee_id == employee_id,
            Task.is_late == True
        )
        .count()
    )

    return {
        "today_attendance": today_status,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "late_tasks": late_tasks
    }