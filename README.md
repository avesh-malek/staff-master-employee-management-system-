# Employee Management System (EMS)

Employee Management System (EMS) is a full-stack web application for managing day-to-day HR operations in a single platform. It supports role-based workflows for `admin`, `hr`, and `employee` users, covering employee records, attendance, leave requests, announcements, and payroll.

The system is designed to reduce manual work by centralizing operational data and providing secure, authenticated access to relevant features for each role.

---

## 🚀 Demo Access Credentials

For testing and evaluation purposes, you can use the following accounts:

### Admin

| Email          | Password |
|----------------|----------|
| admin@ems.com  | admin123 |

### Employee

| Email                  | Password   |
|------------------------|------------|
| aveshmalek@gmail.com   | Avesh@123  |

> ⚠️ Notes:
> - These credentials are for **demo/development use only**
> - Email-based onboarding (real email sending) is not fully implemented yet
> - Currently, system emails are sent only to a single configured email for testing
> - In production, configure a real SMTP service and remove these credentials

---

## Features

### Authentication & Access Control

- JWT-based authentication  
- Protected routes (frontend + backend)  
- Role-based authorization (`admin`, `hr`, `employee`)  
- First-time password setup via email  
- Forgot/reset password flow  
- Session persistence  
- Admin bootstrap endpoint  
- Rate limiting & validation  

### Employee Management

- Create employees with linked user accounts  
- Auto employee code generation (e.g., `EMP001`)  
- Pagination & filtering  
- Update roles and status  
- Delete employees (admin only)  
- Profile view & image upload  
- Search/autocomplete  

### Attendance Management

- Check-in / Check-out  
- Attendance policy configuration  
- Status classification (on-time, late, etc.)  
- Attendance summaries  
- Filters (date, range, employee, department)  
- Excel export  
- Cron-based auto checkout  

### Leave Management

- Apply for leave  
- Leave types (casual, sick, paid, unpaid)  
- Overlap prevention  
- Approve/reject workflow  
- Pagination & filters  
- Email notifications  

### Announcements

- Create & delete announcements  
- Read/unread tracking  
- Email broadcast  

### Payroll

- Monthly payroll generation  
- Salary breakdown (earnings + deductions)  
- Status flow: draft → pending → paid  
- Payslip PDF download  
- Bulk ZIP download  
- Payment tracking  

### Frontend Experience

- Role-based dashboards  
- Sidebar navigation  
- Redux Toolkit state management  
- Reusable components  
- Tailwind + Bootstrap styling  

---

## Tech Stack

### Frontend

- React 19  
- Vite  
- Redux Toolkit  
- React Router DOM  
- Tailwind CSS  
- Bootstrap  

### Backend

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT (`jsonwebtoken`)  
- bcryptjs  
- Nodemailer  
- node-cron  
- Multer  
- ExcelJS  
- PDFKit  
- Archiver  

---

## Project Structure

```text
EMS/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── services/
│   └── vite.config.js
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd EMS
```

### 2. Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Backend runs on:
```
http://localhost:5000
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
APP_BASE_URL=http://localhost:5173
ADMIN_SETUP_KEY=
EMAIL_PROVIDER=smtp
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

### Frontend (`Frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Usage

### Admin / HR

- Manage employees  
- Monitor attendance  
- Handle leave requests  
- Create announcements  
- Manage payroll  

### Employee

- View profile  
- Mark attendance  
- Apply for leave  
- View announcements  
- Download payslips  

---

## API Overview

### Auth
- POST `/api/auth/login`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password/:token`
- POST `/api/auth/set-password/:token`
- POST `/api/auth/bootstrap-admin`
- GET `/api/auth/me`

### Employees
- CRUD + search + profile picture

### Attendance
- Check-in/out, policy, export

### Leave
- Apply, approve/reject

### Payroll
- Generate, pay, payslips

---

## Deployment

### Frontend (Vercel)

- Root: `Frontend`
- Build: `npm run build`
- Output: `dist`
- Env:
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Backend (Render / Railway)

- Start: `npm start`
- Add environment variables
- Use MongoDB Atlas
- Configure CORS

---

## Screenshots / Demo

Add screenshots here:
- Login page  
- Admin dashboard  
- Employee dashboard  
- Payroll module  

---

## Future Improvements

- Automated testing  
- Docker support  
- Refresh tokens  
- Audit logs  
- Analytics dashboard  
- Mobile app  

---

## License

This project currently does not include a license file.