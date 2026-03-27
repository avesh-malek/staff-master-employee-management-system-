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
  const { list: announcements, loading, actionLoading, error } =
    useSelector((state) => state.announcements);

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
      <h6 className="mb-3 fw-semibold text-dark">Announcements</h6>

      {error && (
        <div className="alert alert-danger py-2 small">{error}</div>
      )}

      {/* CREATE */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body p-3">
          <h6 className="mb-2 fw-semibold small">
            Create Announcement
          </h6>

          <div className="mb-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <textarea
              className="form-control form-control-sm"
              rows="2"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="text-end">
            <button
              className="btn btn-primary btn-sm px-3 py-1"
              onClick={handlePublish}
              disabled={actionLoading}
              style={{ fontSize: "12px" }}
            >
              {actionLoading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-3">
          <h6 className="mb-2 fw-semibold small">Published</h6>

          {loading ? (
            <p className="mb-0 small">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="mb-0 small text-muted">
              No announcements yet
            </p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="border rounded p-2"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    
                    {/* Content */}
                    <div>
                      <div className="fw-semibold small">
                        {announcement.title}
                      </div>

                      <div
                        className="text-muted small"
                        style={{ lineHeight: "1.3" }}
                      >
                        {announcement.message}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      className="btn btn-sm btn-outline-danger px-2 py-0"
                      style={{ fontSize: "11px" }}
                      onClick={() =>
                        dispatch(deleteAnnouncement(announcement._id))
                      }
                    >
                      Delete
                    </button>
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

export default AdminAnnouncements;