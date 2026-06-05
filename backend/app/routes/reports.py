from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from openpyxl import Workbook

from datetime import datetime
from datetime import timedelta

from typing import List

import os

from app.database import SessionLocal

from app.models.attendance import Attendance
from app.models.task import Task
from app.models.employees import Employee

from app.schemas.report import (
    ReportDateResponse
)

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

REPORTS_DIR = "reports"
os.makedirs(
    REPORTS_DIR,
    exist_ok=True
)

@router.get(  # Get available report dates for the last 60 days
    "/dates",
    response_model=List[ReportDateResponse]
)
def get_report_dates(
    admin_id: int = Depends(get_current_admin)
):
    dates = []
    today = datetime.now()
    for i in range(60):
        report_day = (
            today - timedelta(days=i)
        )
        dates.append(
            {
                "date": report_day.strftime(
                    "%d-%m-%Y"
                )
            }
        )
    return dates

@router.get(     # Generate and download attendance report for a specific date
    "/attendance/{report_date}"
)
def attendance_report(
    report_date: str,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):

    try:

        selected_date = datetime.strptime(
            report_date,
            "%d-%m-%Y"
        ).date()

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail="Date format must be DD-MM-YYYY"
        )

    workbook = Workbook()

    sheet = workbook.active

    sheet.title = "Attendance"

    sheet.append([
        "Employee ID",
        "Employee Name",
        "Date",
        "Time",
        "Status",
        "Latitude",
        "Longitude"
    ])

    records = (
        db.query(Attendance)
        .filter(
            Attendance.date == selected_date
        )
        .all()
    )

    for record in records:

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == record.employee_id
            )
            .first()
        )

        employee_name = (
            employee.name
            if employee
            else "Unknown"
        )

        sheet.append([
            record.employee_id,
            employee_name,
            str(record.date),
            str(record.time),
            record.status,
            record.latitude,
            record.longitude
        ])

    filename = os.path.join(
        REPORTS_DIR,
        f"attendance_report_{report_date}.xlsx"
    )

    workbook.save(filename)

    return FileResponse(
        path=filename,
        filename=os.path.basename(filename),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.get(   # Generate and download task report for a specific date
    "/tasks/{report_date}"
)
def task_report(
    report_date: str,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):

    try:

        selected_date = datetime.strptime(
            report_date,
            "%d-%m-%Y"
        ).date()

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail="Date format must be DD-MM-YYYY"
        )

    workbook = Workbook()

    sheet = workbook.active

    sheet.title = "Tasks"

    sheet.append([
        "Task ID",
        "Title",
        "Description",
        "Employee ID",
        "Employee Name",
        "Status",
        "Is Late",
        "Assigned At",
        "Completed At"
    ])

    tasks = (
        db.query(Task)
        .all()
    )

    for task in tasks:

        if task.assigned_at.date() != selected_date:
            continue

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == task.employee_id
            )
            .first()
        )

        employee_name = (
            employee.name
            if employee
            else "Unknown"
        )

        sheet.append([
        task.id,
        task.title,
        task.description,
        task.employee_id,
        employee_name,
        task.status,
        task.is_late,

        task.assigned_at.strftime(
            "%d-%m-%Y %H:%M:%S"
        ),

        task.completed_at.strftime(
            "%d-%m-%Y %H:%M:%S"
        )
        if task.completed_at
        else "Not Completed"
    ])

    filename = os.path.join(
        REPORTS_DIR,
        f"task_report_{report_date}.xlsx"
    )

    workbook.save(filename)

    return FileResponse(
        path=filename,
        filename=os.path.basename(filename),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


@router.get(     # Generate and download summary report for a specific date
    "/summary/{report_date}"
)
def summary_report(
    report_date: str,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):

    try:

        selected_date = datetime.strptime(
            report_date,
            "%d-%m-%Y"
        ).date()

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail="Date format must be DD-MM-YYYY"
        )

    workbook = Workbook()

    sheet = workbook.active

    sheet.title = "Summary"

    total_employees = (
        db.query(Employee)
        .filter(
            Employee.status == "active"
        )
        .count()
    )

    present = (
        db.query(Attendance)
        .filter(
            Attendance.date == selected_date,
            Attendance.status == "present"
        )
        .count()
    )

    late = (
        db.query(Attendance)
        .filter(
            Attendance.date == selected_date,
            Attendance.status == "late"
        )
        .count()
    )

    absent = (
        db.query(Attendance)
        .filter(
            Attendance.date == selected_date,
            Attendance.status == "absent"
        )
        .count()
    )

    marked = (
        db.query(Attendance)
        .filter(
            Attendance.date == selected_date
        )
        .count()
    )

    not_marked = (
        total_employees - marked
    )

    completed_tasks = 0

    tasks = (
        db.query(Task)
        .filter(
            Task.completed_at.isnot(None)
        )
        .all()
    )

    for task in tasks:

        if task.completed_at.date() == selected_date:
            completed_tasks += 1

    pending_tasks = (
        db.query(Task)
        .filter(
            Task.status == "pending"
        )
        .count()
    )

    sheet.append([
        "Metric",
        "Value"
    ])

    sheet.append([
        "Total Employees",
        total_employees
    ])

    sheet.append([
        "Present",
        present
    ])

    sheet.append([
        "Late",
        late
    ])

    sheet.append([
        "Absent",
        absent
    ])

    sheet.append([
        "Not Marked",
        not_marked
    ])

    sheet.append([
        "Pending Tasks",
        pending_tasks
    ])

    sheet.append([
        "Completed Tasks",
        completed_tasks
    ])

    filename = os.path.join(
        REPORTS_DIR,
        f"summary_report_{report_date}.xlsx"
    )

    workbook.save(filename)

    return FileResponse(
        path=filename,
        filename=os.path.basename(filename),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )