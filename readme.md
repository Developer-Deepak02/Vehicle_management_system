# 🚗 Vehicle Management System (VMS)

A full-stack web application for managing drivers, managers, vehicles, and vehicle assignments, with secure authentication and role-based access control.

Built with **React** on the frontend and **Node.js, Express.js, and MongoDB** on the backend.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Role-Based Access Control](#-role-based-access-control)
- [Project Structure](#-project-structure)
- [Getting Started](#️-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Application Flows](#-application-flows)
- [Database Models](#️-database-models)
- [Security](#️-security)
- [Deployment](#-deployment)
- [API Testing](#-api-testing)
- [Project Status](#-project-status)
- [Developer](#-developer)
- [License](#-license)

---

## 📌 Overview

VMS lets an organization manage its fleet and drivers from one centralized platform. Every user sees only the functionality permitted for their role.

| Role | Responsibilities |
|------|------------------|
| **Admin** | Manage managers, drivers, and vehicles; assign/unassign vehicles; activate/deactivate users and vehicles; view system statistics; manage own profile and password |
| **Manager** | Manage drivers and vehicles; assign/unassign vehicles; activate/deactivate drivers and vehicles; view management statistics; manage own profile and password |
| **Driver** | View assigned vehicle; update personal information; manage profile; change password; submit driving license information |

---

## 🚀 Features

### Authentication & Authorization
- User registration with email OTP verification
- Login / logout with JWT-based authentication
- Role-based authorization and protected routes
- Forgot password and password reset via OTP
- Resend OTP
- Automatic user authentication on page load
- Secure password hashing with bcrypt

### Admin Management
- Admin dashboard
- Add, edit, and delete managers
- Manager invitation system
- Activate/deactivate managers
- View manager verification status
- Manager search and pagination

### Driver Management
- Add, edit, view, and delete drivers
- Activate/deactivate drivers
- Search, filtering, and pagination
- Driving license submission and verification
- Driver profile management

### Vehicle Management
- Add, edit, view, and delete vehicles
- Activate/deactivate vehicles
- Vehicle photo upload with Cloudinary storage
- Search, filtering, and pagination
- Vehicle status management
- Vehicle assignment and unassignment

### Driver & Vehicle Assignment

A driver can be assigned to one vehicle, and a vehicle to one driver. Before assigning, the system validates:

- Driver role
- Driver verification
- Driving license verification
- Driver's existing vehicle assignment
- Vehicle availability
- Vehicle active status

Assignment and unassignment use **MongoDB transactions** to keep driver and vehicle records consistent.

### Dashboards

**Admin Dashboard**
- Total vehicles, drivers, and managers
- Vehicles and drivers added by managers
- Unassigned vehicles and drivers
- Managers who have not yet joined

**Manager Dashboard**
- Total vehicles and drivers
- Vehicles and drivers added by the manager
- Unassigned vehicles and drivers

---

## 🛠️ Tech Stack

**Frontend**
- React, React Router
- JavaScript
- Tailwind CSS
- Lucide React (icons)
- Axios
- React Hot Toast

**Backend**
- Node.js, Express.js
- MongoDB with Mongoose
- JWT, bcrypt
- Nodemailer
- Multer

**Cloud Services**
- MongoDB Atlas
- Cloudinary
- SMTP / email service

**Development Tools**
- VS Code, Git, GitHub
- Bruno / Postman for API testing

---

## 🏗️ Architecture

The project uses a separate frontend and backend architecture.

```text
                    ┌─────────────────┐
                    │     Browser     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    └────────┬────────┘
                             │ REST API
                             ▼
                    ┌─────────────────┐
                    │ Node / Express  │
                    │     Backend     │
                    └──────┬───┬──────┘
                           │   │
                ┌──────────┘   └──────────┐
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │   MongoDB    │          │  Cloudinary  │
        │    Atlas     │          │    Images    │
        └──────────────┘          └──────────────┘
```

---

## 🔐 Role-Based Access Control

```text
Admin
├── Manage Managers
├── Manage Drivers
├── Manage Vehicles
├── Assign / Unassign Vehicles
├── Activate / Deactivate Users
├── Activate / Deactivate Vehicles
└── Admin Dashboard

Manager
├── Manage Drivers
├── Manage Vehicles
├── Assign / Unassign Vehicles
├── Activate / Deactivate Drivers
├── Activate / Deactivate Vehicles
└── Manager Dashboard

Driver
├── View Assigned Vehicle
├── Update Profile
├── Change Password
└── Submit Driving License
```

---

## 📂 Project Structure

```text
Vehicle Management System
│
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── userController.js
│   │   └── vehicleController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── model
│   │   ├── User.js
│   │   └── Vehicle.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils
│   │   ├── generateOtp.js
│   │   ├── sendEmail.js
│   │   └── uploadToCloudinary.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend
    ├── src
    │   ├── components
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── layouts
    │   │   └── MainLayout.jsx
    │   ├── pages
    │   │   ├── admin
    │   │   ├── management
    │   │   │   ├── Drivers.jsx
    │   │   │   ├── AddDriver.jsx
    │   │   │   ├── EditDriver.jsx
    │   │   │   ├── DriverDetails.jsx
    │   │   │   ├── Vehicles.jsx
    │   │   │   ├── AddVehicle.jsx
    │   │   │   ├── EditVehicle.jsx
    │   │   │   └── VehicleDetails.jsx
    │   │   └── driver
    │   ├── services
    │   │   ├── api.js
    │   │   ├── userService.js
    │   │   ├── vehicleService.js
    │   │   └── dashboardService.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account (or a local MongoDB instance with replica set support, required for transactions)
- Cloudinary account
- SMTP email account/service
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Developer-Deepak02/Vehicle_management_system.git
cd Vehicle_management_system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file (see below), then start the app:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Never commit `.env` files or credentials to Git. Make sure `.env` is listed in `.gitignore`.

---

## 🔗 API Overview

**Base URL (local):** `http://localhost:5000/api`

Example endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/me` | Get the currently authenticated user |
| `GET` | `/api/vehicles/all-vehicles` | List vehicles |
| `POST` | `/api/vehicles/create-vehicle` | Create a vehicle |

Routes are organized by module: `authRoutes`, `userRoutes`, `vehicleRoutes`, and `dashboardRoutes`.

---

## 🔑 Application Flows

### Driver Registration

```text
Driver Registration → Generate OTP → Send OTP to Email
→ Verify OTP → Account Verified → Driver Can Login
```

### Manager Invitation

```text
Admin Creates Manager → Invitation Email Sent → Manager Opens Invitation
→ Manager Completes Account Setup → Manager Joins System → Manager Can Login
```

### Login

```text
Email + Password → Validate Credentials → Check Account Status
→ Generate JWT → Return Token → Frontend Stores Authentication State
```

### Vehicle Assignment

```text
Admin / Manager
→ Select Available Vehicle
→ Select Eligible Driver
→ Validate Driver and Vehicle
→ Assign Vehicle
→ Driver.vehicleAssigned updated
→ Vehicle.driverAssigned updated
→ Vehicle Status → Assigned
```

### Vehicle Unassignment

```text
Unassign Vehicle
→ Driver.vehicleAssigned → null
→ Vehicle.driverAssigned → null
→ Vehicle Status → Available
```

---

## 🗄️ Database Models

**User**
- Name, email, password, date of birth, profile picture
- Role, verification status, account status, joined date
- Driving license information and license verification status
- Assigned vehicle
- Created/updated audit information

**Vehicle**
- Name, model, year, type, photos
- Registration number, chassis number, description
- Availability status, active status
- Assigned driver
- Created/updated audit information

---

## 🛡️ Security

- Password hashing with bcrypt
- JWT authentication and protected API routes
- Role-based authorization
- Input validation
- Email OTP verification and password reset verification
- Environment variables for sensitive credentials
- Restricted administrative operations
- MongoDB transactions for vehicle assignment

---

## 🌐 Deployment

The frontend and backend are deployed separately. For production:

1. Configure production environment variables.
2. Update the frontend API URL.
3. Configure backend CORS for the production frontend.
4. Configure MongoDB Atlas network access.
5. Configure Cloudinary credentials.
6. Configure the production email service.
7. Build the frontend (`npm run build`).
8. Deploy the frontend and backend separately.

---

## 🧪 API Testing

Endpoints can be tested with [Bruno](https://www.usebruno.com/) or Postman. Recommended areas to cover:

- Authentication, OTP verification, login
- Forgot password and password reset
- Manager invitation
- Driver CRUD and vehicle CRUD
- Vehicle assignment and unassignment
- User and vehicle activation/deactivation
- Role-based authorization
- Profile updates and change password

---

## 👨‍💻 Developer

**Deepak**
MCA — Chandigarh University
Full-Stack Web Development

---

## 📄 License

This project was developed as a trainee/project assignment for educational and professional development purposes.