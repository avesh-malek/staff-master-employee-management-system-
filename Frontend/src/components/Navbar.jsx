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
import {
  clearAdminNotificationState,
  fetchAdminNotificationUnreadCount,
} from "../features/notifications/adminNotificationSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount: announcementUnreadCount } = useSelector((state) => state.announcements);
  const { unreadCount: adminUnreadCount } = useSelector((state) => state.adminNotifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      if (user.role !== "employee") {
        dispatch(fetchAdminNotificationUnreadCount());
      }
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearEmployeeState());
    dispatch(clearLeaveState());
    dispatch(clearAnnouncementState());
    dispatch(clearAttendanceState());
    dispatch(clearAdminNotificationState());
    navigate("/");
  };

  const totalUnread =
    user?.role === "employee"
      ? announcementUnreadCount
      : announcementUnreadCount + adminUnreadCount;

  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
      <span className="navbar-brand">EMS</span>

      <div className="d-flex align-items-center gap-3">
        <span className="text-light small">
          {user?.name} ({user?.role})
        </span>
        <button
          className="btn btn-outline-light btn-sm position-relative"
          onClick={() => {
            if (user?.role === "employee") {
              navigate("/employee/announcements");
              return;
            }

            navigate("/admin/notifications");
          }}
        >
          Notifications
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
