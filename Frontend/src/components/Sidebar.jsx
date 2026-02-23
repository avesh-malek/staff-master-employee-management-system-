import { Link } from "react-router-dom";
import { useContext} from "react";
import {EmployeeContext} from "../context/EmployeeContext.jsx";

const Sidebar = ({ role }) => {
  const { active} = useContext(EmployeeContext);
  

  const navClass = (name) =>
    `nav-link text-light rounded py-2 ${active === name ? "bg-secondary" : ""}`;

  return (
    <div
      className="bg-dark text-light d-flex flex-column align-items-center pt-4"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      {/* ADMIN */}
      {role === "admin" && (
        <ul className="nav flex-column w-100 px-3 gap-2 text-center">
          <li>
            <Link to="/admin/dashboard" className={navClass("dashboard")}>
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/employees" className={navClass("employees")}>
              Employees
            </Link>
          </li>

          <li>
            <Link to="/admin/add-employee" className={navClass("add-employee")}>
              Add Employee
            </Link>
          </li>

          <li>
            <Link to="/admin/leave-requests" className={navClass("leave")}>
              Leave Requests
            </Link>
          </li>

          <li>
            <Link to="/admin/announcements" className={navClass("announcements")}>
              Announcements
            </Link>
          </li>
        </ul>
      )}

      {/* EMPLOYEE */}
      {role === "employee" && (
        <ul className="nav flex-column w-100 px-3 gap-2 text-center">
          <li>
            <Link to="/employee/dashboard" className={navClass("dashboard")}>
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/employee/profile" className={navClass("profile")}>
              Profile
            </Link>
          </li>

          <li>
            <Link to="/employee/attendance" className={navClass("attendance")}>
              Attendance
            </Link>
          </li>

          <li>
            <Link to="/employee/leave" className={navClass("leave")}>
              Leave
            </Link>
          </li>

          <li>
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
