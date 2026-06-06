# Actual login endpoints.
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import Depends

from sqlalchemy.orm import Session

from fastapi import Request

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import SessionLocal

from app.models.admin import Admin
from app.models.employees import Employee

from app.schemas.auth import (
    LoginRequest,
    TokenResponse
)

from app.utils.security import verify_password
from app.utils.auth import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

limiter = Limiter(
    key_func=get_remote_address
)

def get_db():
    """
    Database dependency.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post( # Admin login endpoint
    "/admin/login",
    response_model=TokenResponse
)
@limiter.limit("5/minute")
def admin_login(
    request: Request,
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint.
    """

    admin = (
        db.query(Admin)
        .filter(Admin.phone == login_data.phone)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone or password"
        )

    valid_password = verify_password( # to verify the provided password against the stored password hash for the admin
        login_data.password,
        admin.password_hash
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone or password"
        )

    token = create_access_token( # produces JWT token
        {
            "admin_id": admin.id
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "name": admin.name
    }

@router.post( # Employee login endpoint
    "/employee/login",
    response_model=TokenResponse
)
@limiter.limit("10/minute")
def employee_login(
    request: Request,
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Employee login endpoint.
    """

    employee = (
        db.query(Employee)
        .filter(
            Employee.phone == login_data.phone
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone or password"
        )

    if employee.status != "active":
        raise HTTPException(
            status_code=403,
            detail="Employee account is inactive"
        )

    valid_password = verify_password(
        login_data.password,
        employee.password_hash
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid phone or password"
        )

    token = create_access_token(
        {
            "employee_id": employee.id
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "name": employee.name
    }