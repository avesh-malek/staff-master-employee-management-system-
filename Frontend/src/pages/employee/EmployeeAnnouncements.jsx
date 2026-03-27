import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncements,
  fetchUnreadCount,
  markAnnouncementRead,
} from "../../features/announcements/announcementSlice";

const EmployeeAnnouncements = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(
    (state) => state.announcements,
  );

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
      <h6 className="mb-3 fw-semibold text-dark">
        Company Announcements
      </h6>

      {error && (
        <div className="alert alert-danger py-2 small">{error}</div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-3">

          {loading ? (
            <p className="mb-0 small">Loading announcements...</p>
          ) : list.length === 0 ? (
            <p className="mb-0 small text-muted">
              No announcements available
            </p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {list.map((announcement) => (
                <div
                  key={announcement._id}
                  className={`border rounded p-2 ${
                    announcement.unread ? "bg-light" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    
                    {/* Title */}
                    <div className="fw-semibold small">
                      {announcement.title}
                    </div>

                    {/* Action */}
                    {announcement.unread ? (
                      <button
                        className="btn btn-sm btn-outline-primary px-2 py-0"
                        style={{ fontSize: "11px" }}
                        onClick={() =>
                          handleMarkRead(announcement._id)
                        }
                      >
                        Mark read
                      </button>
                    ) : (
                      <span className="badge bg-success px-2 py-1">
                        Read
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div
                    className="text-muted small mt-1"
                    style={{ lineHeight: "1.3" }}
                  >
                    {announcement.message}
                  </div>

                  {/* Date */}
                  <div className="text-muted small mt-1">
                    {new Date(
                      announcement.createdAt,
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnnouncements;