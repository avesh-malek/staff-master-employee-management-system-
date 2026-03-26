import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  fetchUnreadCount,
} from "../../features/announcements/announcementSlice";

const AdminAnnouncements = () => {
  const dispatch = useDispatch();
  const { list: announcements, loading, actionLoading, error } = useSelector(
    (state) => state.announcements
  );

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAnnouncements());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handlePublish = async () => {
    if (!title.trim() || !message.trim()) return;
    const result = await dispatch(addAnnouncement({ title, message }));
    if (!result.error) {
      setTitle("");
      setMessage("");
      dispatch(fetchUnreadCount());
    }
  };

  return (
    <div>
  {/* HEADER */}
  <div className="mb-3">
    <h6 className="fw-semibold text-dark mb-0">Announcements</h6>
  </div>

  {error && <div className="alert alert-danger py-2 small">{error}</div>}

  {/* CREATE */}
  <div className="card shadow border-0 mb-3">
    <div className="card-body py-3">
      <h6 className="mb-3 fw-semibold">Create Announcement</h6>

      <div className="mb-2">
        <label className="form-label small mb-1">Title</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="form-label small mb-1">Message</label>
        <textarea
          className="form-control form-control-sm"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary btn-sm mt-2 px-3"
        onClick={handlePublish}
        disabled={actionLoading}
      >
        {actionLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Publishing...
          </>
        ) : (
          "Publish"
        )}
      </button>
    </div>
  </div>

  {/* LIST */}
  <div className="card shadow border-0">
    <div className="card-body py-3">
      <h6 className="mb-3 fw-semibold">Published</h6>

      {loading && <p className="mb-2 small">Loading announcements...</p>}

      {!loading && announcements.length === 0 && (
        <p className="text-muted small mb-0">No announcements yet</p>
      )}

      <div className="d-flex flex-column gap-2">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="border rounded px-3 py-2"
          >
            <div className="d-flex justify-content-between align-items-start">
              
              <div>
                <div className="fw-semibold small">
                  {announcement.title}
                </div>
                <div className="text-muted small">
                  {announcement.message}
                </div>
              </div>

              <button
                className="btn btn-outline-danger btn-sm px-2 py-0"
                style={{ fontSize: "12px" }}
                onClick={() =>
                  dispatch(deleteAnnouncement(announcement._id))
                }
              >
                Delete
              </button>
            </div>

            <div className="text-muted" style={{ fontSize: "11px" }}>
              {new Date(announcement.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  );
};

export default AdminAnnouncements;
