# Employee Management System (EMS)

Employee Management System (EMS) is a full-stack web application for managing day-to-day HR operations in a single platform. It supports role-based workflows for `admin`, `hr`, and `employee` users, covering employee records, attendance, leave requests, announcements, and payroll.

The system is designed to reduce manual work by centralizing operational data and providing secure, authenticated access to relevant features for each role. Administrators and HR users can manage staff operations, while employees can access their own profile, attendance, leave history, announcements, and salary records.

---

## 🚀 Demo Admin Credentials

For testing and evaluation purposes, you can use:

| Role  | Email          | Password |
|-------|----------------|----------|
| Admin | admin@ems.com | admin123 |

> ⚠️ Note:
> - These credentials are for **demo/development use only**
> - Change or disable them in production
> - You can also create a new admin using `POST /api/auth/bootstrap-admin`

---

## Features

### Authentication & Access Control

- JWT-based authentication  
- Protected routes on both frontend and backend  
- Role-based authorization for `admin`, `hr`, and `employee`  
- First-time password setup via email link  
- Forgot password and reset password flow  
- Current user session restoration from stored token  
- Admin bootstrap endpoint for creating the first admin account  
- Login rate limiting and centralized validation/error handling  

### Employee Management

- Create employee records with linked user accounts  
- Automatic employee code generation (e.g., `EMP001`)  
- List employees with pagination  
- Filter employees by employment status  
- View employee details  
- Update employee records, role, and employment status  
- Delete employee records (admin only)  
- Employee self-profile view  
- Profile picture upload (admin/HR + employee)  
- Employee search endpoint (autocomplete by name or employee code)  

### Attendance Management

- Employee check-in and check-out  
- Attendance policy management:
  - office start time  
  - on-time limit  
  - grace late limit  
  - office end time  
  - half-day hours  
  - auto checkout toggle  
- Automatic check-in status classification:
  - on time  
  - grace late  
  - late  
- Computed attendance status:
  - present  
  - present (late)  
  - present (grace late)  
  - half day  
  - early leave  
  - absent  
  - not checked-in  
- Employee monthly attendance view (filters + pagination)  
- Admin attendance management with:
  - employee filter  
  - searchable autocomplete  
  - date & range filters  
  - department filter  
  - status filter  
  - pagination  
- Attendance dashboard summary  
- Excel export (admin + employee)  
- Cron-based auto checkout  

### Leave Management

- Employees can apply for leave  
- Leave types:
  - casual  
  - sick  
  - paid  
  - unpaid  
- Overlapping leave prevention  
- Admin/HR approval workflow  
- Leave listing with filters  
- Pagination support  
- Unread request count  
- Delete pending requests  
- Email notifications  

### Announcements

- Admin/HR can create announcements  
- All users can view announcements  
- Read/unread tracking  
- Unread count endpoint  
- Delete announcements  
- Email distribution to employees  

### Payroll

- Monthly payroll generation  
- Salary breakdown:
  - earnings (basic, hra, allowance, bonus)  
  - deductions (pf, tax, leave deduction)  
  - net salary  
- Payroll status flow:
  - draft → pending → paid  
- Filters, search, pagination  
- Summary totals  
- Mark salary as paid (method, date, transaction ID, paidBy)  
- Employee salary view  
- Payslip PDF download  
- Bulk ZIP download  
- Access control  

### Frontend Experience

- Role-based dashboards  
- Sidebar navigation  
- Redux Toolkit state management  
- Reusable components  
- Full-screen loader  
- Tailwind + Bootstrap styling  

---

## Tech Stack

### Frontend

- React 19  
- Vite  
- Redux Toolkit  
- React Redux  
- React Router DOM  
- Bootstrap 5  
- Tailwind CSS  
- React Icons  

### Backend

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- JSON Web Token (`jsonwebtoken`)  
- bcryptjs  
- Nodemailer  
- node-cron  
- Multer  
- ExcelJS  
- PDFKit  
- Archiver  
- express-validator  
- helmet  
- express-rate-limit  
- cors  

---

## Project Structure

```text
EMS/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md