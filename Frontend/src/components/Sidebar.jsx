import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role }) => {
  const location = useLocation();

  const path = location.pathname;

  let active = "";
  if (path.includes("dashboard")) active = "dashboard";
  else if (path.includes("employees")) active = "employees";
  else if (path.includes("add-employee")) active = "add-employee";
  else if (path.includes("attendance")) active = "attendance";
  else if (path.includes("/admin/leaves") || path.includes("leave-requests")) active = "leave";
  else if (path.includes("leave")) active = "leave";
  else if (path.includes("profile")) active = "profile";
  else if (path.includes("announcements")) active = "announcements";

  const navClass = (name) =>
    `nav-link text-light rounded py-2 ${active === name ? "bg-secondary" : ""}`;

  const showAdminMenu = role === "admin" || role === "hr";

  return (
  <div
  className="d-flex flex-column pt-4"
  style={{
    width: "220px",
    minHeight: "100vh",
    backgroundColor: "#1e293b",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  }}
>
    {showAdminMenu && (
      <ul className="nav flex-column w-100 px-3 gap-2">
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
          <Link to="/admin/leaves" className={navClass("leave")}>
            Leave Requests
          </Link>
        </li>
        <li>
          <Link to="/admin/attendance" className={navClass("attendance")}>
            Attendance
          </Link>
        </li>
        <li>
          <Link to="/admin/announcements" className={navClass("announcements")}>
            Announcements
          </Link>
        </li>
      </ul>
    )}

    {role === "employee" && (
      <ul className="nav flex-column w-100 px-3 gap-2">
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
          <Link to="/employee/announcements" className={navClass("announcements")}>
            Announcements
          </Link>
        </li>
      </ul>
    )}
  </div>
);
};

export default Sidebar;
