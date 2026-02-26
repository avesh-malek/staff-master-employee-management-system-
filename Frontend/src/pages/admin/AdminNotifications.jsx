import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAnnouncements,
  fetchUnreadCount,
  markAnnouncementRead,
} from "../../features/announcements/announcementSlice";
import {
  fetchAdminNotifications,
  fetchAdminNotificationUnreadCount,
  markAdminNotificationRead,
} from "../../features/notifications/adminNotificationSlice";

const AdminNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: announcements, loading: announcementsLoading } = useSelector(
    (state) => state.announcements
  );
  const { list: adminNotifications, loading: adminNotificationsLoading, error } = useSelector(
    (state) => state.adminNotifications
  );

  useEffect(() => {
    dispatch(fetchAnnouncements());
    dispatch(fetchUnreadCount());
    dispatch(fetchAdminNotifications());
    dispatch(fetchAdminNotificationUnreadCount());
  }, [dispatch]);

  const notificationItems = useMemo(() => {
    const leaveItems = adminNotifications.map((item) => ({
      key: `leave-${item._id}`,
      id: item._id,
      type: "leave_request",
      title: item.title,
      message: item.message,
      isRead: item.isRead,
      createdAt: item.createdAt,
      link: item.link || "/admin/leaves",
    }));

    const announcementItems = announcements.map((item) => ({
      key: `announcement-${item._id}`,
      id: item._id,
      type: "announcement",
      title: item.title,
      message: item.message,
      isRead: !item.unread,
      createdAt: item.createdAt,
      link: "/admin/announcements",
    }));

    return [...leaveItems, ...announcementItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [announcements, adminNotifications]);

  const handleOpen = async (item) => {
    if (item.type === "leave_request") {
      await dispatch(markAdminNotificationRead(item.id));
      dispatch(fetchAdminNotificationUnreadCount());
      navigate("/admin/leaves");
      return;
    }

    await dispatch(markAnnouncementRead(item.id));
    dispatch(fetchUnreadCount());
    navigate("/admin/announcements");
  };

  const loading = announcementsLoading || adminNotificationsLoading;

  return (
    <div>
      <h3 className="mb-4 fw-bold">Notifications</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <p className="mb-2">Loading notifications...</p>}

          {!loading && notificationItems.length === 0 && (
            <p className="text-muted mb-0">No notifications available</p>
          )}

          {notificationItems.map((item) => (
            <button
              key={item.key}
              className="w-100 text-start border rounded p-3 mb-3 bg-white"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpen(item)}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-bold mb-0">{item.title}</h6>
                <span className={`badge ${item.isRead ? "bg-success" : "bg-danger"}`}>
                  {item.isRead ? "Read" : "Unread"}
                </span>
              </div>
              <p className="mb-1">{item.message}</p>
              <small className="text-muted">
                {item.type === "leave_request" ? "Leave Request" : "Announcement"} |{" "}
                {new Date(item.createdAt).toLocaleString()}
              </small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
