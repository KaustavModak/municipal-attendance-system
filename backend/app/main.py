from fastapi import FastAPI
from fastapi import Request

from fastapi.responses import JSONResponse

from slowapi import Limiter
from slowapi.util import get_remote_address

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from fastapi.middleware.cors import CORSMiddleware

from app.database import SessionLocal
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
from app.routes.dashboard import (
    router as dashboard_router
)
from app.routes.profile import (
    router as profile_router
)
from app.routes.admin_dashboard import (
    router as admin_dashboard_router
)
from app.routes.upload import (
    router as upload_router
)
from app.models.audit_log import AuditLog
from app.routes.audit_logs import (
    router as audit_logs_router
)
from app.routes.error_logs import (
    router as error_logs_router
)
from app.utils.error_logger import (
    create_error_log
)
from app.routes.reports import (
    router as reports_router
)

limiter = Limiter(
    key_func=get_remote_address
)

app = FastAPI(
    title="Municipal Attendance System"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.include_router(auth_router)
app.include_router(protected_router)
app.include_router(employee_router)
app.include_router(office_router)
app.include_router(attendance_router)
app.include_router(task_router)
app.include_router(dashboard_router)
app.include_router(profile_router)
app.include_router(admin_dashboard_router)
app.include_router(upload_router)
app.include_router(audit_logs_router)
app.include_router(error_logs_router)
app.include_router(reports_router)


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):
    """
    Log unexpected errors.
    """

    db = SessionLocal()

    try:

        create_error_log(
            db=db,
            route=str(request.url.path),
            error_message=str(exc)
        )

    finally:

        db.close()

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error"
        }
    )

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

# @app.get("/crash-test")
# def crash_test():

#     x = 1 / 0

#     return {
#         "result": x
#     }