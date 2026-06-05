# Municipal Attendance & Task Management System

A modern workforce management platform designed for municipal corporations, government departments, and field operation teams.

## Project Structure

```text
municipal_attendance_system/
│
├── backend/
│   ├── FastAPI
│   ├── MySQL
│   ├── Cloudinary
│   └── REST APIs
│
└── frontend/
    ├── Next.js
    ├── TailwindCSS
    └── Mobile-First UI
```

## Features

### Employee Management

* Create employees
* Update employees
* Activate/Deactivate employees
* Office assignment

### Attendance Management

* GPS-based attendance
* Radius validation
* Attendance history
* Manual attendance

### Task Management

* Task assignment
* Task completion
* Evidence image upload
* Task history

### Reports

* Attendance Reports
* Task Reports
* Summary Reports
* Last 60 Days Reports

### Monitoring

* Audit Logs
* Error Logs

### Security

* JWT Authentication
* Role-Based Access Control
* Password Hashing
* Rate Limiting
* CORS Protection

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* MySQL
* Cloudinary

### Frontend

* Next.js
* TailwindCSS
* TypeScript

## Running the Project

### Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm run dev
```

## Project Status

Backend: Complete (V1.0)

Frontend: Under Development

Future Mobile App: Planned
