# Validates login requests.
from pydantic import BaseModel


class LoginRequest(BaseModel):
    """
    Request body for login.
    """

    phone: str
    password: str


class TokenResponse(BaseModel):
    """
    Response returned after login.
    """
    access_token: str
    token_type: str
    name: str