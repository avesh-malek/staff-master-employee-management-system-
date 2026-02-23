import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  addAnnouncement,
  deleteAnnouncement,
} from "../../features/announcements/announcementSlice";

const AdminAnnouncements = () => {
  const dispatch = useDispatch();
  const announcements = useSelector(
    (state) => state.announcements.list
  );

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handlePublish = () => {
    if (!title.trim() || !message.trim()) return;

    dispatch(addAnnouncement(title, message));

    setTitle("");
    setMessage("");
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Admin Announcements</h3>

      {/* Create Announcement */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Create Announcement</h5>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Announcement message"
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handlePublish}
          >
            Publish Announcement
          </button>
        </div>
      </div>

      {/* Announcement List */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Published Announcements</h5>

          {announcements.length === 0 && (
            <p className="text-muted">No announcements yet</p>
          )}

          {announcements.map((a) => (
            <div
              key={a.id}
              className="border rounded p-3 mb-3"
            >
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-1">{a.title}</h6>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() =>
                    dispatch(deleteAnnouncement(a.id))
                  }
                >
                  Delete
                </button>
              </div>

              <p className="mb-1">{a.message}</p>
              <small className="text-muted">
                Posted on {a.date}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
