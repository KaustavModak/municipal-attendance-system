from typing import List
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.office import Office

from app.schemas.offices import (
    OfficeCreate,
    OfficeResponse,
    OfficeUpdate
)

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/offices",
    tags=["Offices"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# Endpoint to create new office 
@router.post(
    "/",
    response_model=OfficeResponse
)
def create_office(
    office_data: OfficeCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Create a new office.
    """

    existing_office = (
        db.query(Office)
        .filter(
            Office.office_name ==
            office_data.office_name
        )
        .first()
    )

    if existing_office:
        raise HTTPException(
            status_code=400,
            detail="Office already exists"
        )

    office = Office(
        office_name=office_data.office_name,
        latitude=office_data.latitude,
        longitude=office_data.longitude,
        radius_meters=office_data.radius_meters
    )

    db.add(office)

    db.commit()

    db.refresh(office)

    return office

# Endpoint to get all offices
@router.get(
    "/",
    response_model=List[OfficeResponse]
)
def get_all_offices(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get all offices.
    """

    offices = (
        db.query(Office)
        .all()
    )

    return offices

# Endpoint to get one office
@router.get(
    "/{office_id}",
    response_model=OfficeResponse
)
def get_office(
    office_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get one office.
    """

    office = (
        db.query(Office)
        .filter(Office.id == office_id)
        .first()
    )

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    return office


# Endpoint to update office details
@router.put(
    "/{office_id}",
    response_model=OfficeResponse
)
def update_office(
    office_id: int,
    office_data: OfficeUpdate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Update office.
    """

    office = (
        db.query(Office)
        .filter(Office.id == office_id)
        .first()
    )

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    office.office_name = office_data.office_name
    office.latitude = office_data.latitude
    office.longitude = office_data.longitude
    office.radius_meters = office_data.radius_meters

    db.commit()

    db.refresh(office)

    return office