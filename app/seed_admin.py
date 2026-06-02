from app.database import SessionLocal

from app.models.admin import Admin

from app.utils.security import hash_password


db = SessionLocal()

# Check if admin already exists
existing_admin = db.query(Admin).first()

if existing_admin:
    print("Admin already exists.")

else:
    admin = Admin(
        name="TestAdmin1",
        phone="9999999999",
        password_hash=hash_password("admin123")
    )

    db.add(admin)

    db.commit()

    print("Admin created successfully.")

db.close()