from pydantic import BaseModel


class EmployeeCreate(BaseModel): # For creating new employee
    name: str
    phone: str
    password: str
    office_id: int


class EmployeeResponse(BaseModel): # For returning employee data in API responses
    id: int
    name: str
    phone: str
    office_id: int
    status: str

    class Config:
        from_attributes = True

class EmployeeStatusUpdate(BaseModel): # For updating employee status 
    status: str

class EmployeeUpdate(BaseModel): # For updating employee details (except status)
    name: str
    phone: str
    office_id: int