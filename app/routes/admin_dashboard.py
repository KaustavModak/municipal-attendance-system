from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from datetime import datetime
import pytz

from app.database import SessionLocal

from app.models.employees import Employee
from app.models.attendance import Attendance
from app.models.task import Task

from app.schemas.admin_dashboard import (
    AdminDashboardResponse
)

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get(
    "/",
    response_model=AdminDashboardResponse
)
def admin_dashboard(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    india_timezone = pytz.timezone(
        "Asia/Kolkata"
    )

    today = datetime.now(
        india_timezone
    ).date()

    total_employees = (
        db.query(Employee)
        .filter(Employee.status == "active")
        .count()
    )

    present_today = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "present"
        )
        .count()
    )

    late_today = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "late"
        )
        .count()
    )

    absent_today = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "absent"
        )
        .count()
    )

    attendance_marked = (
        db.query(Attendance)
        .filter(
            Attendance.date == today
        )
        .count()
    )

    not_marked_today = (
        total_employees
        - attendance_marked
    )

    pending_tasks = (
        db.query(Task)
        .filter(Task.status == "pending")
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .filter(Task.status == "completed")
        .count()
    )

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "late_today": late_today,
        "absent_today": absent_today,
        "not_marked_today": not_marked_today,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks
    }