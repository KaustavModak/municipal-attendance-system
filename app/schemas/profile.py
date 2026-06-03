from pydantic import BaseModel


class EmployeeProfileResponse(BaseModel): # For returning employee profile data in API responses
    id: int
    name: str
    phone: str
    office_id: int
    status: str

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel): # For handling change password requests in API
    old_password: str
    new_password: str