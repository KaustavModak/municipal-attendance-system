from pydantic import BaseModel
from datetime import date, time

class AttendanceCreate(BaseModel): # For creating new attendance record
    latitude: float
    longitude: float
    selfie_url: str


class AttendanceResponse(BaseModel): # For returning attendance data in API responses
    id: int
    employee_id: int
    status: str
    latitude: float
    longitude: float
    selfie_url: str

    class Config:
        from_attributes = True


class AttendanceListResponse(BaseModel): # For returning attendance data in API responses when listing all records
    id: int
    employee_id: int
    date: date
    time: time
    status: str

    class Config:
        from_attributes = True


class TodayAttendanceResponse(BaseModel): # For returning attendance summary for today in API responses
    total_employees: int
    present: int
    late: int
    marked_absent: int
    not_marked: int

class TodayAttendanceDetailResponse(BaseModel): # For returning detailed attendance records for today in API responses
    employee_name: str
    status: str

class AttendanceHistoryResponse(BaseModel): # For returning attendance history for an employee in API responses
    date: date
    time: time
    status: str

    class Config:
        from_attributes = True

class ManualAttendanceCreate(BaseModel): # For creating manual attendance record (used by admin when marking attendance for employees who could not mark)
    employee_id: int
    status: str