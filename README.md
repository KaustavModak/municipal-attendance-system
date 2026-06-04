# Municipal Attendance & Task Management System

## Overview

Municipal Attendance & Task Management System is a workforce management platform designed for municipal corporations, government departments, and field operations teams.

The system enables administrators to manage employees, offices, attendance records, and field tasks while allowing employees to mark attendance using GPS verification, complete assigned tasks, upload proof images, and track their work history.

The platform is designed to improve transparency, accountability, and operational efficiency in municipal field operations.

---

## Key Features

### Authentication & Authorization

* Secure JWT-based authentication
* Separate Admin and Employee roles
* Protected API endpoints
* Password hashing using bcrypt

### Employee Management

* Create employees
* View employee details
* Update employee information
* Activate or deactivate employees
* Office assignment management

### Office Management

* Create offices
* Define office GPS coordinates
* Configure attendance radius
* Update office information

### Attendance Management

* GPS-based attendance validation
* Radius verification using office location
* Attendance status classification:

  * Present
  * Late
  * Absent
* Attendance history tracking
* Manual attendance override by administrators
* Daily attendance reports and summaries

### Task Management

* Assign tasks to employees
* Track task completion
* Record completion location
* Late task detection
* Upload task completion evidence
* View task history

### Dashboard

#### Employee Dashboard

* Today's attendance status
* Pending tasks
* Completed tasks
* Late tasks

#### Admin Dashboard

* Total employees
* Present employees
* Late employees
* Attendance pending employees
* Pending tasks
* Completed tasks

### Cloud Image Storage

* Cloudinary integration
* Attendance selfie storage
* Task evidence image storage
* Secure image URLs

---

## Technology Stack

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Passlib (bcrypt)

### Database

* MySQL

### Cloud Storage

* Cloudinary

### Other Libraries

* python-jose
* python-multipart
* pytz

---

## System Architecture

Admin
↓
Authentication
↓
Employee Management
↓
Office Management
↓
Task Assignment

Employee
↓
Authentication
↓
GPS Attendance
↓
Task Completion
↓
Evidence Upload

Database
↓
Attendance Records
Task Records
Employee Records

Cloudinary
↓
Attendance Images
Task Images

---

## Core Modules

### Authentication Module

* Admin Login
* Employee Login
* JWT Token Generation
* Token Verification

### Employee Module

* Create Employee
* View Employees
* Update Employee
* Change Employee Status

### Office Module

* Create Office
* Update Office
* View Offices

### Attendance Module

* Mark Attendance
* Attendance History
* Attendance Reports
* Manual Attendance

### Task Module

* Create Task
* Complete Task
* Upload Evidence
* View Task Images
* Task History

### Dashboard Module

* Employee Dashboard
* Admin Dashboard

### Profile Module

* View Profile
* Change Password

---

## Environment Variables

Create a `.env` file in the project root.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=municipal_attendance

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd municipal_attendance_system
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
uvicorn app.main:app --reload
```

### API Documentation

Swagger UI:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

---

## Security Features

* JWT Authentication
* Password Hashing
* Role-Based Access Control
* Protected Routes
* Ownership Validation
* GPS Attendance Verification

---

## Future Roadmap

### Planned Enhancements

* Mobile Application
* Push Notifications
* Attendance Analytics
* Employee Search & Filtering
* Task Reassignment
* Audit Logs
* Multi-Level Admin Roles
* Attendance Export (Excel/PDF)
* Reporting Dashboard
* Geofencing Enhancements

---

## License

Private/Internal Use.

All rights reserved.

---

## Contact

For deployment, customization, or support, contact the system administrator.
