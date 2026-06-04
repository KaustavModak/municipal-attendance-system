# Municipal Attendance & Task Management System

## Overview

Municipal Attendance & Task Management System is a workforce management platform designed for municipal corporations, government departments, field operations teams, and public service organizations.

The platform enables administrators to manage employees, offices, attendance records, field tasks, reports, and operational monitoring while allowing employees to mark attendance using GPS verification, complete assigned tasks, upload proof images, and track work history.

The system focuses on transparency, accountability, operational efficiency, and auditability of field operations.

---

# Features

## Authentication & Authorization

* JWT-based authentication
* Separate Admin and Employee roles
* Protected API endpoints
* Password hashing using bcrypt
* Role-based access control

---

## Employee Management

* Create employee
* View employee details
* Update employee information
* Activate employee
* Deactivate employee
* Office assignment management

---

## Office Management

* Create office
* Update office
* Delete office
* View office details
* Configure GPS attendance radius

---

## Attendance Management

* GPS-based attendance validation
* Office radius verification
* Automatic attendance classification

Attendance statuses:

* Present
* Late
* Absent

Additional Features:

* Attendance history
* Today's attendance summary
* Detailed attendance view
* Manual attendance override by administrators
* Attendance reports

---

## Task Management

* Assign tasks to employees
* Task deadline tracking
* Task completion tracking
* Late task detection
* Completion location recording
* Task evidence upload
* Task image management
* Task detail view
* Task history

Task Statuses:

* Pending
* Completed

---

## Evidence Image Management

* Cloudinary integration
* Task proof image upload
* Employee image viewing
* Admin image viewing
* Admin image deletion
* Audit tracking for image deletion

---

## Dashboard

### Employee Dashboard

Displays:

* Attendance status
* Pending tasks
* Completed tasks
* Late tasks

### Admin Dashboard

Displays:

* Total employees
* Present employees
* Late employees
* Attendance pending employees
* Pending tasks
* Completed tasks

---

## Reports Module

Administrators can download reports for any date from the last 60 days.

Available Reports:

### Attendance Report

Includes:

* Employee ID
* Employee Name
* Attendance Status
* Date
* Time

### Task Report

Includes:

* Task ID
* Task Title
* Employee Name
* Status
* Deadline
* Completion Time
* Late Status

### Summary Report

Includes:

* Total Employees
* Present Employees
* Late Employees
* Absent Employees
* Pending Tasks
* Completed Tasks

Reports are exported in Excel format (.xlsx).

---

## Audit Logging

Tracks all critical administrator actions.

Examples:

* Employee creation
* Employee updates
* Employee status changes
* Office creation
* Office deletion
* Task assignment
* Manual attendance marking
* Task image deletion

Audit Log Fields:

* Admin ID
* Action
* Entity Type
* Entity ID
* Details
* Timestamp

---

## Error Logging

Automatically records internal server errors.

Captured Information:

* Route
* Error message
* Timestamp

Used for:

* Debugging
* Monitoring
* Production troubleshooting

---

## Database Backup

Supports manual database backup generation.

Features:

* Full MySQL dump
* Structure backup
* Data backup
* Timestamped backup files

Backups are stored locally inside:

database_backups/

---

# Security Features

## Authentication

* JWT Tokens
* Token validation
* Protected routes

## Password Security

* bcrypt password hashing
* Password verification

## Access Control

* Admin-only endpoints
* Employee-only endpoints
* Ownership validation

## Attendance Security

* GPS validation
* Office radius verification

## API Protection

* Rate limiting
* Request throttling
* CORS protection

---

# Technology Stack

## Backend

* FastAPI
* SQLAlchemy
* Pydantic

## Database

* MySQL

## Cloud Storage

* Cloudinary

## Authentication

* JWT
* python-jose

## Security

* bcrypt
* Passlib

## Utilities

* pytz
* python-multipart
* openpyxl

---

# System Architecture

Admin
↓
Authentication
↓
Employee Management
↓
Office Management
↓
Attendance Monitoring
↓
Task Assignment
↓
Reports
↓
Audit Monitoring

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
Employees
Attendance
Tasks
Audit Logs
Error Logs

Cloudinary
↓
Task Evidence Images

---

# API Modules

## Authentication

* Admin Login
* Employee Login

## Employees

* Create Employee
* Update Employee
* Activate/Deactivate Employee
* Get Employee
* List Employees

## Offices

* Create Office
* Update Office
* Delete Office
* Get Office
* List Offices

## Attendance

* Mark Attendance
* Attendance History
* Attendance Summary
* Manual Attendance

## Tasks

* Create Task
* Complete Task
* Task Details
* Upload Evidence
* View Evidence
* Delete Evidence
* Task History

## Reports

* Attendance Report
* Task Report
* Summary Report
* Available Report Dates

## Monitoring

* Audit Logs
* Error Logs

---

# Environment Variables

Create a `.env` file in project root.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=municipal_db

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd municipal_attendance_system
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Application

```bash
uvicorn app.main:app --reload
```

---

# API Documentation

Swagger:

http://localhost:8000/docs

ReDoc:

http://localhost:8000/redoc

---

# Project Structure

```text
app/
├── models/
├── routes/
├── schemas/
├── utils/
├── database.py
├── config.py
├── main.py

reports/
database_backups/
temp_uploads/

backup_database.py
requirements.txt
README.md
```

---

# Deployment Readiness

Current Backend Status:

* Authentication Complete
* Employee Module Complete
* Office Module Complete
* Attendance Module Complete
* Task Module Complete
* Reports Module Complete
* Audit Logs Complete
* Error Logs Complete
* Database Backup Complete
* Security Layer Complete

Backend Version: V1.0 Production Ready

---

# Future Roadmap (V2)

* Refresh Tokens
* Change Password
* Forgot Password
* Leave Management
* Attendance Correction Requests
* Push Notifications
* Mobile Application
* Advanced Analytics Dashboard
* Multi-Level Admin Roles
* Soft Delete System

---

# License

Private/Internal Use.

All rights reserved.
