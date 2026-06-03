from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

import os
import uuid

from app.utils.cloudinary import upload_image


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/image")
def upload_image_file(
    file: UploadFile = File(...)
):
    """
    Upload image to Cloudinary.
    """

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files allowed"
        )

    os.makedirs(
        "temp_uploads",
        exist_ok=True
    )

    temp_filename = (
        f"temp_uploads/{uuid.uuid4()}_{file.filename}"
    )

    with open(
        temp_filename,
        "wb"
    ) as buffer:
        buffer.write(
            file.file.read()
        )

    image_url = upload_image(
        temp_filename
    )

    if os.path.exists(temp_filename):
        os.remove(temp_filename)

    return {
        "image_url": image_url
    }