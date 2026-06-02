from fastapi import FastAPI

from app.database import engine
from app.routes.auth import router as auth_router
from app.routes.test_protected import (
    router as protected_router
)
from app.routes.employees import (
    router as employee_router
)
from app.routes.offices import (
    router as office_router
)
from app.routes.attendance import (
    router as attendance_router
)
from app.routes.tasks import (
    router as task_router
)

app = FastAPI(
    title="Municipal Attendance System"
)

app.include_router(auth_router)
app.include_router(protected_router)
app.include_router(employee_router)
app.include_router(office_router)
app.include_router(attendance_router)
app.include_router(task_router)

@app.get("/")
def root():
    return {
        "message": "Municipal Attendance System Running"
    }


# @app.get("/db-test")
# def db_test():
#     try:
#         conn = engine.connect()
#         conn.close()

#         return {
#             "status": "Database Connected Successfully"
#         }

#     except Exception as e:
#         return {
#             "error": str(e)
#         }