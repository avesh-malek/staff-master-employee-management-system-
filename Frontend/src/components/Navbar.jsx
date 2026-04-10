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
  <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
    
    {/* Left */}
    <span className="text-white font-semibold text-lg tracking-wide">
      EMS
    </span>

    {/* Right */}
    <div className="flex items-center gap-4">
      
      <span className="text-slate-300 text-sm">
        {user?.name} ({user?.role})
      </span>

      <button
        onClick={() =>
          navigate(
            user?.role === "employee"
              ? "/employee/announcements"
              : "/admin/leaves"
          )
        }
        className="relative border border-slate-600 text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
      >
        🔔

        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {totalUnread}
          </span>
        )}
      </button>

      <button
        onClick={handleLogout}
        className="border border-slate-600 text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
      >
        Logout
      </button>

    </div>
  </nav>
);
};

export default Navbar;
