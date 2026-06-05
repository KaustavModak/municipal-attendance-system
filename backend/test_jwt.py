from app.utils.auth import create_access_token

token = create_access_token(
    {
        "employee_id": 1
    }
)

print(token)