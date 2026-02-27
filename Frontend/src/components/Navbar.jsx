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
      dispatch(fetchAdminLeaveUnreadCount());
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
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
      <span className="navbar-brand">EMS</span>

      <div className="d-flex align-items-center gap-3">
        <span className="text-light small">
          {user?.name} ({user?.role})
        </span>

        <button
          className="btn btn-outline-light btn-sm position-relative"
          onClick={() =>
            navigate(
              user?.role === "employee"
                ? "/employee/announcements"
                : "/admin/leaves?status=pending",
            )
          }
        >
          notification
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
