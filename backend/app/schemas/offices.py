from pydantic import BaseModel


class OfficeCreate(BaseModel): # For creating new office
    office_name: str
    latitude: float
    longitude: float
    radius_meters: int


class OfficeResponse(BaseModel): # For returning office data in API responses
    id: int
    office_name: str
    latitude: float
    longitude: float
    radius_meters: int

    class Config:
        from_attributes = True


class OfficeUpdate(BaseModel): # For updating office details
    office_name: str
    latitude: float
    longitude: float
    radius_meters: int