import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { clearEmployeeState } from "../features/employees/employeeSlice";
import { clearLeaveState } from "../features/leave/leaveSlice";
import {
  clearAnnouncementState,
  fetchUnreadCount,
} from "../features/announcements/announcementSlice";
import { clearAttendanceState } from "../features/attendance/attendanceSlice";
import { fetchAdminLeaveUnreadCount } from "../features/leave/leaveSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount: announcementUnreadCount } = useSelector(
    (state) => state.announcements,
  );
  const { unreadCount: leaveUnreadCount } = useSelector((state) => state.leave);

  useEffect(() => {
    if (user?.role === "employee") {
      dispatch(fetchUnreadCount());
    }

    if (user?.role === "admin") {
      // first load
      dispatch(fetchAdminLeaveUnreadCount());

      // refresh every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchAdminLeaveUnreadCount());
      }, 30000);

      // cleanup when component unmounts
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearEmployeeState());
    dispatch(clearLeaveState());
    dispatch(clearAnnouncementState());
    dispatch(clearAttendanceState());
    navigate("/");
  };

  const totalUnread =
    user?.role === "admin" ? leaveUnreadCount : announcementUnreadCount;
  return (
    <nav
      className="navbar px-4 d-flex justify-content-between"
      style={{
        backgroundColor: "#1e293b",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="navbar-brand text-light fw-semibold">EMS</span>

      <div className="d-flex align-items-center gap-3">
        <span className="text-light small opacity-75">
          {user?.name} ({user?.role})
        </span>

        <button
          className="btn btn-outline-light btn-sm position-relative"
          onClick={() =>
            navigate(
              user?.role === "employee"
                ? "/employee/announcements"
                : "/admin/leaves",
            )
          }
        >
          Notification
          {totalUnread > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalUnread}
            </span>
          )}
        </button>

        <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
