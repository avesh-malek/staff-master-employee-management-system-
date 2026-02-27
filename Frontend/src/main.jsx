import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./features/store";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import PasswordSetup from "./pages/auth/PasswordSetup";

import AdminDashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeProfile from "./pages/admin/EmployeeProfile";
import LeaveRequests from "./pages/admin/LeaveRequests";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import EditEmployee from "./pages/admin/EditEmployee";
import AttendanceManagement from "./pages/admin/AttendanceManagement";

import EmployeeDashboard from "./pages/employee/Dashboard";
import Profile from "./pages/employee/Profile";
import Attendance from "./pages/employee/Attendance";
import Leave from "./pages/employee/Leave";
import EmployeeAnnouncements from "./pages/employee/EmployeeAnnouncements";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/set-password/:token", element: <PasswordSetup /> },
  { path: "/reset-password/:token", element: <PasswordSetup /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/employees",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <Employees />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/add-employee",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <AddEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/employee/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <EmployeeProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/leave-requests",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <LeaveRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/leaves",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <LeaveRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/attendance",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <AttendanceManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/announcements",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <AdminAnnouncements />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "admin/employees/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <EditEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee/profile",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee/attendance",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee/leave",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <Leave />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee/announcements",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeAnnouncements />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
