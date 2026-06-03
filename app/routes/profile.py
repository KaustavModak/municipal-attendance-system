from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.employees import Employee

from app.schemas.profile import (
    EmployeeProfileResponse,
    ChangePasswordRequest
)

from app.utils.dependencies import (
    get_current_employee
)
from app.utils.security import (
    verify_password,
    hash_password
)

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get(
    "/",
    response_model=EmployeeProfileResponse
)
def get_profile(
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Get logged-in employee profile.
    """

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee

@router.put(
    "/change-password"
)
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Change employee password.
    """

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    valid_password = verify_password(
        password_data.old_password,
        employee.password_hash
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Incorrect old password"
        )

    employee.password_hash = hash_password(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }