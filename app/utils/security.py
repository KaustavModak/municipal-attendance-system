# Plain Password
#       ↓
# Hash Password
"""
security.py

Handles password hashing and password verification.
Never store plain text passwords in database.
"""

from passlib.context import CryptContext

# Configure bcrypt hashing
pwd_context = CryptContext(
    schemes=["bcrypt"], # Use bcrypt algorithm
    deprecated="auto"
)


def hash_password(password: str) -> str:  # Every time it generates a different hash.
    """ 
    Convert plain password into hashed password.

    Example:
    admin123
        ↓
    $2b$12$abcxyz...
    """

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Compare entered password
    with stored hashed password.
    """

    return pwd_context.verify(
        plain_password,
        hashed_password
    )