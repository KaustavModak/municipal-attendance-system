from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

import cloudinary.uploader

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
    MyTaskResponse,
    TaskDetailResponse
    )

from app.utils.dependencies import (
    get_current_admin,
    get_current_employee
)
from app.utils.audit import create_audit_log
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
    create_audit_log(
        db=db,
        admin_id=admin_id,
        action="CREATE_TASK",
        entity_type="Task",
        entity_id=task.id,
        details=f"Assigned task '{task.title}' to employee {task.employee_id}"
    )
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
        .order_by(Task.id.desc())
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
    image_count = (
        db.query(TaskImage)
        .filter(TaskImage.task_id == task_id)
        .count()
    )

    if image_count == 0:
        raise HTTPException(
            status_code=400,
            detail="Upload at least one proof image before completing task"
        )
    ist = pytz.timezone("Asia/Kolkata")
    completion_time = datetime.now(ist)
    task.status = "completed"
    task.completed_at = completion_time
    deadline = task.deadline
    if deadline.tzinfo is None:
        deadline = ist.localize(deadline)
    task.is_late = completion_time > deadline
    task.completion_lat = task_data.latitude
    task.completion_lng = task_data.longitude
    db.commit()
    db.refresh(task)
    return task

@router.post(   # Add image evidence to a task
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

    task_image = TaskImage(
        task_id=task_id,
        image_url=image_data.image_url,
        public_id=image_data.public_id
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
    Get all images of a task for employee.
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

@router.get( # Admin can view all images of any task
    "/admin/{task_id}/images",
    response_model=List[TaskImageResponse]
)
def get_task_images_admin(
    task_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Admin can view all images
    uploaded for any task.
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

    images = (
        db.query(TaskImage)
        .filter(
            TaskImage.task_id == task_id
        )
        .all()
    )

    return images


@router.get(
    "/my/history",
    response_model=List[MyTaskResponse]
)
def get_my_task_history(
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Get completed task history
    of logged-in employee.
    """

    tasks = (
        db.query(Task)
        .filter(
            Task.employee_id == employee_id,
            Task.status == "completed"
        )
        .order_by(
            Task.completed_at.desc()
        )
        .all()
    )

    return tasks

@router.get(
    "/my/tasks",
    response_model=List[MyTaskResponse]
)
def get_my_tasks(
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Get all tasks assigned to
    the logged-in employee.
    """

    tasks = (
        db.query(Task)
        .filter(
            Task.employee_id == employee_id
        )
        .order_by(Task.status.asc())
        .all()
    )

    return tasks

@router.delete(
    "/images/{image_id}"
)
def delete_task_image(
    image_id: int,
    db: Session = Depends(get_db),
    employee_id: int = Depends(get_current_employee)
):
    """
    Delete task image.
    """

    image = (
        db.query(TaskImage)
        .filter(
            TaskImage.id == image_id
        )
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    task = (
        db.query(Task)
        .filter(
            Task.id == image.task_id
        )
        .first()
    )

    if task.employee_id != employee_id:
        raise HTTPException(
            status_code=403,
            detail="Not your task"
        )

    try:

        public_id = (
            image.image_url
            .split("/")[-1]
            .split(".")[0]
        )

        cloudinary.uploader.destroy(
            public_id
        )

    except:
        pass

    db.delete(image)

    db.commit()

    return {
        "message": "Task image deleted successfully"
    }


@router.get(   # Get detailed information about a task
    "/{task_id}",
    response_model=TaskDetailResponse
)
def get_task_details(
    task_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Get detailed information
    about a task.
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

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == task.employee_id
        )
        .first()
    )

    employee_name = (
        employee.name
        if employee
        else "Unknown"
    )

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "employee_id": task.employee_id,
        "employee_name": employee_name,
        "assigned_by": task.assigned_by,
        "status": task.status,
        "deadline": task.deadline,
        "assigned_at": task.assigned_at,
        "completed_at": task.completed_at,
        "is_late": task.is_late,
        "completion_lat": task.completion_lat,
        "completion_lng": task.completion_lng
    }

@router.delete(  # Admin can delete any task image
    "/admin/images/{image_id}"
)
def delete_task_image_admin(
    image_id: int,
    db: Session = Depends(get_db),
    admin_id: int = Depends(get_current_admin)
):
    """
    Admin deletes image evidence.
    """

    image = (
        db.query(TaskImage)
        .filter(
            TaskImage.id == image_id
        )
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    if image.public_id:
        cloudinary.uploader.destroy(
            image.public_id
        )
    db.delete(image)
    db.commit()
    create_audit_log(
        db=db,
        admin_id=admin_id,
        action="DELETE_TASK_IMAGE",
        entity_type="TaskImage",
        entity_id=image_id,
        details="Admin deleted task evidence image"
    )

    return {
        "message":
        "Task image deleted successfully"
    }

@router.get(
    "/my/tasks/{task_id}"
)
def get_my_task_details(
    task_id: int,
    db: Session = Depends(get_db),
    employee_id: int = Depends(
        get_current_employee
    )
):
    """
    Get details of a task
    assigned to the logged-in
    employee.
    """

    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.employee_id == employee_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "employee_id": task.employee_id,
        "assigned_by": task.assigned_by,
        "status": task.status,
        "deadline": task.deadline,
        "assigned_at": task.assigned_at,
        "completed_at": task.completed_at,
        "is_late": task.is_late,
        "completion_lat": task.completion_lat,
        "completion_lng": task.completion_lng
    }