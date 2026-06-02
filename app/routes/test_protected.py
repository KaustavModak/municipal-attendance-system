from fastapi import APIRouter
from fastapi import Depends

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/test",
    tags=["Protected Test"]
)


@router.get("/protected")
def protected_route(
    admin_id: int = Depends(
        get_current_admin
    )
):
    return {
        "message": "Access Granted",
        "admin_id": admin_id
    }