from jose import jwt
from jose import JWTError

from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from app.config import settings
from app.models.employees import Employee

security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Verify admin JWT token.
    """

    token = credentials.credentials

    try:

        payload = jwt.decode( # decode the JWT token using the secret key and algorithm specified in the settings
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        admin_id = payload.get("admin_id")

        if admin_id is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        return admin_id

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
    
def get_current_employee(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Verify employee JWT token.
    """

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        employee_id = payload.get(
            "employee_id"
        )

        if employee_id is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        return employee_id

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )