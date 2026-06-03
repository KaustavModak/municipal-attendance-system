import cloudinary
import cloudinary.uploader

from app.config import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


def upload_image(file_path: str):
    """
    Upload image to Cloudinary.
    """

    result = cloudinary.uploader.upload(
        file_path
    )

    return result["secure_url"]