import { Link, useLocation } from "react-router-dom";
import { useRole } from "../context/RoleContex";

const Sidebar = ({}) => {
  const location = useLocation();
  const { role, isAdmin, isHR, isEmployee } = useRole();

  const path = location.pathname;

  let active = "";
  if (path.includes("dashboard")) active = "dashboard";
  else if (path.includes("employees")) active = "employees";
  else if (path.includes("add-employee")) active = "add-employee";
  else if (path.includes("payroll") || path.includes("salary"))
    active = "payroll";
  else if (path.includes("attendance")) active = "attendance";
  else if (path.includes("/admin/leaves") || path.includes("leave-requests"))
    active = "leave";
  else if (path.includes("leave")) active = "leave";
  else if (path.includes("profile")) active = "profile";
  else if (path.includes("announcements")) active = "announcements";

  const navClass = (name) =>
    `nav-link text-light rounded py-2 px-3 d-block ${
      active === name ? "bg-secondary" : ""
    }`;
  return (
    <div className="w-[210px] min-h-screen bg-slate-900 border-r border-slate-800 pt-6">
      {/* ADMIN */}
      {isAdmin && (
        <ul className="flex flex-col px-4 gap-2 w-full">
          <li className="w-full">
            <Link to="/admin/dashboard" className={navClass("dashboard")}>
              Dashboard
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/employees" className={navClass("employees")}>
              Employees
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/add-employee" className={navClass("add-employee")}>
              Add Employee
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/leaves" className={navClass("leave")}>
              Leave Requests
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/attendance" className={navClass("attendance")}>
              Attendance
            </Link>
          </li>
<li className="w-full">
  <Link to="/admin/payroll" className={navClass("payroll")}>
    Payroll
  </Link>
</li>
          <li className="w-full">
            <Link
              to="/admin/announcements"
              className={navClass("announcements")}
            >
              Announcements
            </Link>
          </li>
        </ul>
      )}

      {/* HR */}
      {isHR && (
        <ul className="flex flex-col px-4 gap-2 w-full">
          <li className="w-full">
            <Link to="/admin/dashboard" className={navClass("dashboard")}>
              Dashboard
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/employees" className={navClass("employees")}>
              Employees
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/add-employee" className={navClass("add-employee")}>
              Add Employee
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/leaves" className={navClass("leave")}>
              Leave Requests
            </Link>
          </li>
          <li className="w-full">
            <Link to="/admin/attendance" className={navClass("attendance")}>
              Attendance
            </Link>
          </li>
          <li className="w-full">
            <Link to="/employee/salary" className={navClass("payroll")}>
              My Salary
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/admin/announcements"
              className={navClass("announcements")}
            >
              Announcements
            </Link>
          </li>
        </ul>
      )}

      {/* EMPLOYEE */}
      {isEmployee && (
        <ul className="flex flex-col px-4 gap-2 w-full">
          <li className="w-full">
            <Link to="/employee/dashboard" className={navClass("dashboard")}>
              Dashboard
            </Link>
          </li>
          <li className="w-full">
            <Link to="/employee/profile" className={navClass("profile")}>
              Profile
            </Link>
          </li>
          <li className="w-full">
            <Link to="/employee/leave" className={navClass("leave")}>
              Leave
            </Link>
          </li>
          <li className="w-full">
            <Link to="/employee/attendance" className={navClass("attendance")}>
              Attendance
            </Link>
          </li>
          <li className="w-full">
            <Link to="/employee/salary" className={navClass("payroll")}>
              My Salary
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/employee/announcements"
              className={navClass("announcements")}
            >
              Announcements
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
