import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncements,
  fetchUnreadCount,
  markAnnouncementRead,
} from "../../features/announcements/announcementSlice";

const EmployeeAnnouncements = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.announcements);

  useEffect(() => {
    dispatch(fetchAnnouncements());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    await dispatch(markAnnouncementRead(id));
    dispatch(fetchUnreadCount());
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Company Announcements</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading && <p>Loading announcements...</p>}
      {!loading && list.length === 0 && <p className="text-muted">No announcements available</p>}

      {list.map((announcement) => (
        <div className="card shadow-sm mb-3" key={announcement._id}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">{announcement.title}</h5>
              {announcement.unread ? (
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleMarkRead(announcement._id)}>
                  Mark as read
                </button>
              ) : (
                <span className="badge bg-success">Read</span>
              )}
            </div>
            <p className="mt-2">{announcement.message}</p>
            <small className="text-muted">Posted on {new Date(announcement.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeAnnouncements;
