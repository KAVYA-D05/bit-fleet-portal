# 🚍 BIT Centralized Vehicle Fleet Booking Portal

### Bannari Amman Institute of Technology (Autonomous)

A centralized full-stack web application for managing **faculty official visits, guest pickups, student field trips, vehicle allocation, driver assignments, gate passes, and fleet operations**.

The system replaces manual vehicle-booking processes with a centralized digital platform that provides **role-based access, conflict detection, vehicle scheduling, trip management, and fleet monitoring**.

---

## 📌 Problem Statement

Institutional vehicle booking is often handled through manual requests, phone calls, spreadsheets, and paper-based approvals. This can lead to:

- Vehicle double-booking
- Driver scheduling conflicts
- Delayed approvals
- Difficulty tracking trip details
- Manual passenger-list management
- Lack of centralized fleet information
- Difficulty auditing fuel, toll, and vehicle usage

The BIT Centralized Vehicle Fleet Booking Portal addresses these issues through a single digital platform.

---

## 🎯 Objectives

- Centralize institutional vehicle booking.
- Prevent vehicle and driver scheduling conflicts.
- Simplify faculty and staff requisition.
- Provide efficient vehicle and driver allocation.
- Digitize passenger manifests and gate passes.
- Track trip and vehicle operational details.
- Provide fleet utilization and administrative insights.
- Improve transparency and reduce manual paperwork.

---

## ✨ Key Features

### 👨‍🏫 Faculty / Staff

- Vehicle booking request
- Multi-step booking workflow
- Trip and destination details
- Passenger/student manifest
- Emergency contact details
- Booking status tracking
- Conflict detection
- Gate pass generation
- Trip history

### 🧑‍💼 Transport Administrator

- Centralized booking verification
- Approve/reject requests
- Vehicle allocation
- Driver allocation
- Fleet scheduling
- Conflict monitoring
- Booking management
- Vehicle and driver information
- Administrative dashboard

### 🚍 Driver / Fleet Operator

- View assigned trips
- Trip dispatch details
- Starting and ending odometer readings
- Fuel consumption tracking
- Toll expense logging
- Trip completion updates

### 📊 Management / Auditor

- Fleet utilization monitoring
- Department-wise trip distribution
- Vehicle usage analysis
- Fuel expense auditing
- Trip and booking statistics

---

## 🧠 Smart Conflict Detection

The system prevents double-booking by comparing the requested trip interval with existing reservations.

A conflict exists when:

```text
(Start_requested < End_existing)
AND
(End_requested > Start_existing)
```

This ensures that the same vehicle or driver cannot be assigned to overlapping trips.

---

## 🪪 Passenger Manifest & Gate Pass

The portal supports:

- Student passenger lists
- Roll number entry
- Emergency contact information
- Bulk passenger data entry
- Passenger verification
- Printable vehicle movement/gate pass
- Security sign-off information

This provides a digital alternative to manual field-trip documentation.

---

## 👥 Role-Based Access Control

The system supports multiple operational roles:

| Role | Main Responsibility |
|---|---|
| Faculty / Staff | Request and track vehicles |
| Transport Admin | Verify, approve and allocate vehicles |
| Driver | Execute and update assigned trips |
| Management / Auditor | Monitor fleet utilization and expenses |

---

## 🛠️ Technology Stack

### Frontend

- React.js 18
- JavaScript / TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Leaflet

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB
- Mongoose ODM

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 🏗️ System Architecture

```text
                   ┌──────────────────────┐
                   │       User           │
                   │ Faculty / Admin /    │
                   │ Driver / Management  │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   React Frontend     │
                   │   Vite + Tailwind    │
                   └──────────┬───────────┘
                              │
                         REST API
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Express Backend    │
                   │ Authentication       │
                   │ Booking Management   │
                   │ Conflict Detection   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │      MongoDB         │
                   │ Users                │
                   │ Vehicles             │
                   │ Drivers              │
                   │ Bookings             │
                   │ Trip Data            │
                   └──────────────────────┘
```

---

## 📁 Project Structure

```text
bit-fleet-portal/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   │
│   └── package.json
│
├── package.json
└── README.md
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd bit-fleet-portal
```

## 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

This installs dependencies for both the frontend and backend.

---

## 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000

MONGODB_URI=mongodb+srv://transportadmin:<password>@cluster0.mongodb.net/bit_fleet_portal?retryWrites=true&w=majority

JWT_SECRET=your_secure_jwt_secret

NODE_ENV=development
```

### Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used for JWT authentication |
| `NODE_ENV` | Application environment |

> **Important:** Never commit your `.env` file or database password to GitHub.

---

# ▶️ Running the Application

## Start Backend

From the project root:

```bash
npm run server
```

Backend runs on:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
npm run client
```

Frontend runs on:

```text
http://localhost:3000
```

Open the application in your browser:

```text
http://localhost:3000
```

---

# 🌱 Seed Demo Data

If the project contains the seed-data utility, run:

```bash
cd server
npm run seed
```

This can be used to populate initial users, vehicles, drivers, and booking data.

---

# 🔐 Authentication

The application uses:

- JWT for authentication
- bcryptjs for password hashing
- Role-based authorization

Authentication flow:

```text
Login
  ↓
Validate Credentials
  ↓
Generate JWT
  ↓
Store Authentication State
  ↓
Access Role-Specific Dashboard
```

---

# 👤 Demo Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| Faculty | Dr. Rajesh Kumar | `rajeshkumar@bitsathy.ac.in` | `bit12345` |
| Transport Admin | Mr. Senthil Nathan | `transport.admin@bitsathy.ac.in` | `bit12345` |
| Driver | Murugan K | `murugan.driver@bitsathy.ac.in` | `bit12345` |

> Demo credentials should be changed before deploying the application to a production environment.

---

# 🔄 Booking Workflow

```text
Faculty
   │
   ▼
Create Vehicle Request
   │
   ▼
Enter Trip Details
   │
   ▼
Add Passenger Manifest
   │
   ▼
Conflict Detection
   │
   ▼
Transport Admin Verification
   │
   ├── Reject ──► Request Closed
   │
   ▼
Vehicle & Driver Allocation
   │
   ▼
Gate Pass Generation
   │
   ▼
Driver Executes Trip
   │
   ▼
Odometer / Fuel / Toll Updates
   │
   ▼
Trip Completed
   │
   ▼
Fleet Records & Reports
```

---

# 🚍 Vehicle Management

The system can maintain information such as:

- Vehicle registration number
- Vehicle type
- Seating capacity
- Vehicle availability
- Assigned driver
- Operational status
- Trip history

---

# 👨‍✈️ Driver Management

Driver information can include:

- Driver name
- Contact information
- License details
- Driver availability
- Assigned trips
- Trip history

---

# 📍 Location & Mapping

The application uses **Leaflet** for map-based functionality.

Possible use cases include:

- Trip destinations
- Route visualization
- Location information
- Vehicle movement tracking

---

# 📊 Fleet Management Dashboard

The administrative dashboard provides centralized visibility into:

- Total vehicles
- Active bookings
- Pending requests
- Assigned trips
- Driver availability
- Fleet utilization
- Department-wise bookings
- Operational expenses

---

# 🔒 Security

Security features include:

- Password hashing using bcrypt
- JWT-based authentication
- Role-based authorization
- Protected API routes
- Environment-based configuration
- CORS configuration

Sensitive credentials should always be stored in environment variables.

---

# 🧪 Testing

Before deployment, test the following:

### Authentication

- Login with valid credentials
- Reject invalid credentials
- Role-based dashboard access

### Booking

- Create a booking
- Edit booking
- Cancel booking
- Approve/reject booking
- Detect overlapping bookings

### Fleet

- Allocate vehicle
- Allocate driver
- Check vehicle availability
- Update trip status

### Trip

- Start trip
- Record odometer
- Record fuel
- Record toll
- Complete trip

---

# 🚀 Production Build

Build the frontend using:

```bash
cd client
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🌐 Deployment

The application can be deployed using platforms such as:

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas

For production deployment, configure the required environment variables in the hosting platform.

---

# 🔮 Future Enhancements

- AI-based vehicle demand prediction
- Intelligent vehicle allocation
- Predictive vehicle maintenance
- Real-time GPS tracking
- Mobile application
- Automated notifications
- Email/SMS approval alerts
- Advanced fleet analytics
- Fuel efficiency prediction
- Driver performance analytics
- Self-healing fleet management
- AI-powered transport assistant

---

# 💡 Innovation

The portal can be extended into an intelligent fleet management system by combining:

```text
Booking Data
     +
Vehicle Data
     +
Driver Data
     +
Trip History
     +
Fuel Data
     +
Maintenance Data
     ↓
AI / Predictive Analytics
     ↓
Demand Prediction
     ↓
Smart Allocation
     ↓
Predictive Maintenance
     ↓
Optimized Fleet Operations
```

This provides a foundation for developing an **intelligent, predictive, and sustainability-aware institutional fleet management system**.

---

# 🎓 Academic Project

**Project:** BIT Centralized Vehicle Fleet Booking Portal

**Domain:** Full-Stack Web Development / Smart Transportation

**Institution:** Bannari Amman Institute of Technology

**Primary Use Case:** Institutional vehicle booking and fleet management

---

# 📄 License

This project is developed for academic and institutional purposes.

---

## 👩‍💻 Project Team

Developed as an academic full-stack project with the objective of improving institutional transportation management through digital automation.