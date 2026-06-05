from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from typing import List
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.employees import Employee
from app.models.office import Office

from app.schemas.employees import (
    EmployeeCreate,
    EmployeeResponse
)
from app.schemas.employees import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeStatusUpdate,
    EmployeeUpdate
)

from app.utils.security import hash_password

from app.utils.dependencies import (
    get_current_admin
)
from app.utils.audit import create_audit_log

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# Endpoint to create new employee
@router.post(
    "/",
    response_model=EmployeeResponse
)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Create Employee
    """

    # Check if phone already exists
    existing_employee = (
        db.query(Employee)
        .filter(
            Employee.phone ==
            employee_data.phone
        )
        .first()
    )

    if existing_employee:

        raise HTTPException(
            status_code=400,
            detail="Phone already exists"
        )

    # Check office exists
    office = (
        db.query(Office)
        .filter(
            Office.id ==
            employee_data.office_id
        )
        .first()
    )

    if not office:

        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    # Create employee
    employee = Employee(
        name=employee_data.name,
        phone=employee_data.phone,
        password_hash=hash_password(
            employee_data.password
        ),
        office_id=employee_data.office_id
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)
    create_audit_log(
        db=db,
        admin_id=admin_id,
        action="CREATE_EMPLOYEE",
        entity_type="Employee",
        entity_id=employee.id,
        details=f"Created employee {employee.name}"
    )
    return employee

# Endpoint to get all employees
@router.get(
    "/",
    response_model=List[EmployeeResponse]
)
def get_all_employees(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get all employees.
    """

    employees = (
        db.query(Employee)
        .all()
    )

    return employees

# Endpoint to update employee status (active/inactive)
@router.patch(
    "/{employee_id}/status",
    response_model=EmployeeResponse
)
def update_employee_status(
    employee_id: int,
    status_data: EmployeeStatusUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Activate or deactivate an employee.
    """

    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if status_data.status not in [
        "active",
        "inactive"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Status must be active or inactive"
        )

    employee.status = status_data.status

    db.commit()
    db.refresh(employee)
    create_audit_log(
        db=db,
        admin_id=admin_id,
        action="CHANGE_EMPLOYEE_STATUS",
        entity_type="Employee",
        entity_id=employee.id,
        details=f"Status changed to {employee.status}"
    )
    return employee

# Endpoint to get one employee
@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get one employee.
    """

    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee

# Endpoint to update employee details (except status)
@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Update employee details.
    """

    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Check office exists
    office = (
        db.query(Office)
        .filter(
            Office.id ==
            employee_data.office_id
        )
        .first()
    )

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    # Check duplicate phone
    existing_employee = (
        db.query(Employee)
        .filter(
            Employee.phone ==
            employee_data.phone,
            Employee.id != employee_id
        )
        .first()
    )

    if existing_employee:
        raise HTTPException(
            status_code=400,
            detail="Phone already exists"
        )

    employee.name = employee_data.name
    employee.phone = employee_data.phone
    employee.office_id = employee_data.office_id

    db.commit()
    db.refresh(employee)
    create_audit_log(
        db=db,
        admin_id=admin_id,
        action="UPDATE_EMPLOYEE",
        entity_type="Employee",
        entity_id=employee.id,
        details=f"Updated employee {employee.name}"
    )
    return employee


