from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session
import pytz

from app.database import SessionLocal

from app.models.task import Task
from app.models.employees import Employee
from app.models.task_image import TaskImage

from app.schemas.task import (
    TaskCreate,
    TaskResponse,
    TaskComplete,
    TaskImageCreate,
    TaskImageResponse,
    MyTaskResponse
)

from app.utils.dependencies import (
    get_current_admin,
    get_current_employee
)

from typing import List
from datetime import datetime

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

@router.post(  # Create new task
    "/",
    response_model=TaskResponse
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Create a new task.
    """

    employee = (
        db.query(Employee)
        .filter(
            Employee.id ==
            task_data.employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    task = Task(
        title=task_data.title,
        description=task_data.description,
        employee_id=task_data.employee_id,
        assigned_by=admin_id,
        deadline=task_data.deadline,
        status="pending"
    )

    db.add(task)

    db.commit()

    db.refresh(task)

    return task

@router.get(  # Get all tasks
    "/",
    response_model=List[TaskResponse]
)
def get_all_tasks(
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get all tasks.
    """

    tasks = (
        db.query(Task)
        .all()
    )

    return tasks


@router.put(   # Mark task as completed
    "/{task_id}/complete",
    response_model=TaskResponse
)
def complete_task(
    task_id: int,
    task_data: TaskComplete,
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Complete a task.
    """

    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )
    
    if task.employee_id != employee_id: # Only the employee assigned to the task can mark it as completed
        raise HTTPException(
            status_code=403,
            detail="Not your task"
        )

    if task.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Task already completed"
        )

    ist = pytz.timezone("Asia/Kolkata")
    completion_time = datetime.now(ist)

    task.status = "completed"

    task.completed_at = completion_time

    task.completion_lat = task_data.latitude

    task.completion_lng = task_data.longitude

    if completion_time > task.deadline:
        task.is_late = True
    else:
        task.is_late = False

    db.commit()

    db.refresh(task)

    return task

@router.post(   # Add image evidence to a task
    "/{task_id}/images",
    response_model=TaskImageResponse
)
@router.post(
    "/{task_id}/images",
    response_model=TaskImageResponse
)
def add_task_image(
    task_id: int,
    image_data: TaskImageCreate,
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Add image to a task.
    """

    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.employee_id != employee_id:
        raise HTTPException(
            status_code=403,
            detail="Not your task"
        )

    if task.status != "completed":
        raise HTTPException(
            status_code=400,
            detail="Task must be completed first"
        )

    task_image = TaskImage(
        task_id=task_id,
        image_url=image_data.image_url
    )

    db.add(task_image)

    db.commit()

    db.refresh(task_image)

    return task_image


@router.get(
    "/{task_id}/images",
    response_model=List[TaskImageResponse]
)
def get_task_images(
    task_id: int,
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Get all images of a task.
    """

    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.employee_id != employee_id:
        raise HTTPException(
            status_code=403,
            detail="Not your task"
        )

    images = (
        db.query(TaskImage)
        .filter(
            TaskImage.task_id == task_id
        )
        .all()
    )

    return images