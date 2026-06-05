from app.utils.security import (
    hash_password,
    verify_password
)

password = "rahul123"

hashed = hash_password(password)

print("Original:", password)
print("Hash:", hashed)

print(
    verify_password(
        "rahul123",
        hashed
    )
)