from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from datetime import datetime
from datetime import date
import pytz

from app.database import SessionLocal

from app.models.attendance import Attendance
from app.models.employees import Employee
from app.models.office import Office

from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceListResponse,
    TodayAttendanceResponse,
    TodayAttendanceDetailResponse
)

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

from math import radians
from math import sin
from math import cos
from math import sqrt
from math import atan2

def calculate_distance_meters(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Returns distance in meters.
    """

    earth_radius = 6371000

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        +
        cos(radians(lat1))
        *
        cos(radians(lat2))
        *
        sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return earth_radius * c


# Endpoint to mark attendance
@router.post(
    "/",
    response_model=AttendanceResponse
)
def mark_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Mark attendance.
    """

    # Check employee exists
    employee = (
        db.query(Employee)
        .filter(
            Employee.id ==
            attendance_data.employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Employee must be active
    if employee.status != "active":
        raise HTTPException(
            status_code=400,
            detail="Employee is inactive"
        )

    # Check attendance already marked today
    india_timezone = pytz.timezone("Asia/Kolkata")
    current_datetime = datetime.now(
        india_timezone
    )
    today = current_datetime.date()
    current_time = current_datetime.time()

    existing_attendance = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.date == today
        )
        .first()
    )

    if existing_attendance:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked today"
        )

    # Find assigned office
    office = (
        db.query(Office)
        .filter(
            Office.id == employee.office_id
        )
        .first()
    )

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    # Distance calculation
    distance = calculate_distance_meters(
        office.latitude,
        office.longitude,
        attendance_data.latitude,
        attendance_data.longitude
    )

    if distance > office.radius_meters:
        raise HTTPException(
            status_code=400,
            detail="Outside office radius"
        )

    hour = current_time.hour
    minute = current_time.minute

    if (
        (hour > 6 or (hour == 6 and minute >= 0))
        and
        hour < 8
    ):
        status = "present"

    elif (
        (hour == 8 and minute >= 0)
        or
        (hour > 8 and hour < 14)
        or
        (hour == 14 and minute == 0)
    ):
        status = "late"

    else:
        status = "absent"

    attendance = Attendance(
        employee_id=employee.id,
        date=today,
        time=current_time,
        status=status,
        latitude=attendance_data.latitude,
        longitude=attendance_data.longitude,
        selfie_url=attendance_data.selfie_url
    )

    db.add(attendance)

    db.commit()

    db.refresh(attendance)

    return attendance


from typing import List

# Endpoint to get all attendance records
@router.get(
    "/",
    response_model=List[AttendanceListResponse]
)
def get_all_attendance(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get all attendance records.
    """

    attendance_records = (
        db.query(Attendance)
        .all()
    )

    results = []

    for record in attendance_records:
        results.append(
            AttendanceListResponse(
                id=record.id,
                employee_id=record.employee_id,
                date=record.date,
                time=record.time,
                status=record.status
            )
        )

    return results

# @router.get("/time-test")
# def time_test():

#     india_timezone = pytz.timezone(
#         "Asia/Kolkata"
#     )

#     return {
#         "ist_time": str(
#             datetime.now(
#                 india_timezone
#             )
#         )
#     }

@router.get(
    "/today",
    response_model=TodayAttendanceResponse
)
def today_attendance_summary(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Today's attendance summary.
    """

    today = date.today()

    total_employees = (
        db.query(Employee)
        .filter(Employee.status == "active")
        .count()
    )

    present_count = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "present"
        )
        .count()
    )

    late_count = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "late"
        )
        .count()
    )

    marked_absent_count = (
        db.query(Attendance)
        .filter(
            Attendance.date == today,
            Attendance.status == "absent"
        )
        .count()
    )

    attendance_marked_count = (
        db.query(Attendance)
        .filter(
            Attendance.date == today
        )
        .count()
    )

    not_marked_count = (
        total_employees
        - attendance_marked_count
    )

    return {
        "total_employees": total_employees,
        "present": present_count,
        "late": late_count,
        "marked_absent": marked_absent_count,
        "not_marked": not_marked_count
    }

from typing import List


@router.get(
    "/today/details",
    response_model=List[TodayAttendanceDetailResponse]
)
def today_attendance_details(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Detailed attendance for today.
    """

    today = date.today()

    employees = (
        db.query(Employee)
        .filter(Employee.status == "active")
        .all()
    )

    results = []

    for employee in employees:

        attendance = (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee.id,
                Attendance.date == today
            )
            .first()
        )

        if attendance:
            status = attendance.status
        else:
            status = "not_marked"

        results.append(
            {
                "employee_name": employee.name,
                "status": status
            }
        )

    return results