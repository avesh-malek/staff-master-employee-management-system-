import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";

import Login from "./pages/auth/Login";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeProfile from "./pages/admin/EmployeeProfile";
import LeaveRequests from "./pages/admin/LeaveRequests";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
// Employee pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import Profile from "./pages/employee/Profile";
import Attendance from "./pages/employee/Attendance";
import Leave from "./pages/employee/Leave";
import EmployeeAnnouncements from "./pages/employee/EmployeeAnnouncements";
import EditEmployee from "./pages/admin/EditEmployee";


import { Provider } from "react-redux";
import store from "./features/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: (
        <App />
    
    ),
    children: [
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/employees", element: <Employees /> },
      { path: "admin/add-employee", element: <AddEmployee /> },
    { path: "admin/employee/:id", element: <EmployeeProfile /> },
      { path: "admin/leave-requests", element: <LeaveRequests /> },
      { path: "admin/announcements", element: <AdminAnnouncements /> },
      {path: "admin/employees/edit/:id",  element: <EditEmployee />},


      { path: "employee/dashboard", element: <EmployeeDashboard /> },
      { path: "employee/profile", element: <Profile /> },
      { path: "employee/attendance", element: <Attendance /> },
      { path: "employee/leave", element: <Leave /> },
      { path: "employee/announcements", element: <EmployeeAnnouncements /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <Provider store={store}>
  <RouterProvider router={router} />
  </Provider>
);
