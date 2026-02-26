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
      <h3 className="mb-4 fw-bold">Admin Announcements</h3>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Create Announcement</h5>
          <div className="mb-3"><label className="form-label">Title</label><input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={handlePublish} disabled={actionLoading}>{actionLoading ? "Publishing..." : "Publish Announcement"}</button>
        </div>
      </div>

      <div className="card shadow-sm"><div className="card-body">
        <h5 className="mb-3">Published Announcements</h5>
        {loading && <p className="mb-2">Loading announcements...</p>}
        {!loading && announcements.length === 0 && <p className="text-muted">No announcements yet</p>}
        {announcements.map((announcement) => (
          <div key={announcement._id} className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-1">{announcement.title}</h6>
              <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(deleteAnnouncement(announcement._id))}>Delete</button>
            </div>
            <p className="mb-1">{announcement.message}</p>
            <small className="text-muted">Posted on {new Date(announcement.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div></div>
    </div>
  );
};

export default AdminAnnouncements;
