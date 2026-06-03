from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskCreate(BaseModel): # For creating new task
    title: str
    description: str
    employee_id: int
    deadline: datetime


class TaskResponse(BaseModel): # For returning task data in API responses
    id: int
    title: str
    description: str
    employee_id: int
    status: str
    is_late: bool

    class Config:
        from_attributes = True

class TaskComplete(BaseModel): # For marking a task as completed
    latitude: float
    longitude: float

class TaskImageCreate(BaseModel): # For adding image evidence to a task
    image_url: str

class TaskImageResponse(BaseModel): # For returning task image data in API responses
    id: int
    task_id: int
    image_url: str

    class Config:
        from_attributes = True

class MyTaskResponse(BaseModel): # For returning task data in API responses when listing tasks assigned to an employee
    id: int
    title: str
    description: str
    status: str
    is_late: bool

    class Config:
        from_attributes = True