import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyEmployee,
  uploadMyProfilePicture,
} from "../../features/employees/employeeSlice";
import { toAssetUrl } from "../../services/api";

const getStatusMeta = (status) => {
  if (status === "inactive") return { label: "Inactive", badge: "bg-warning text-dark" };
  if (status === "terminated") return { label: "Terminated", badge: "bg-danger" };
  if (status === "on_leave") return { label: "On Leave", badge: "bg-info text-dark" };
  return { label: "Active", badge: "bg-success" };
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myProfile, actionLoading, error } = useSelector((state) => state.employees);

  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchMyEmployee());
  }, [dispatch]);

  const status = getStatusMeta(myProfile?.user?.employmentStatus);

  const handleUpload = async () => {
    if (!file) return;
    const res = await dispatch(uploadMyProfilePicture(file));
    if (!res.error) setFile(null);
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1">My Profile</h4>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          Manage your personal and job information
        </p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small">
          {error}
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body text-center py-4">

          <img
            src={
              myProfile?.profilePic
                ? toAssetUrl(myProfile.profilePic)
                : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
            }
            alt="Profile"
            className="rounded-circle mb-3"
            style={{
              width: "130px",
              height: "130px",
              objectFit: "cover",
            }}
          />

          <h5 className="fw-semibold mb-1">
            {myProfile?.name || user?.name}
          </h5>

          <div className="text-muted small mb-2">
            {myProfile?.designation || user?.role} • {myProfile?.department || "-"}
          </div>

          <span className={`badge ${status.badge}`}>
            {status.label}
          </span>

          {/* UPLOAD */}
          <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
            <input
              type="file"
              className="form-control form-control-sm"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ maxWidth: "250px" }}
            />

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleUpload}
              disabled={actionLoading || !file}
            >
              {actionLoading ? "Uploading..." : "Update Photo"}
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="row g-4">

        {/* PERSONAL */}
        <div className="col-md-6">
          <div className="card shadow border-0 h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Personal Information</h6>

              <div className="small mb-3">
                <div className="text-muted">Email</div>
                <div className="fw-semibold">
                  {myProfile?.email || user?.email || "-"}
                </div>
              </div>

              <div className="small mb-3">
                <div className="text-muted">Phone</div>
                <div className="fw-semibold">
                  {myProfile?.phone || "-"}
                </div>
              </div>

              <div className="small">
                <div className="text-muted">Address</div>
                <div className="fw-semibold">
                  {myProfile?.address || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* JOB */}
        <div className="col-md-6">
          <div className="card shadow border-0 h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Job Details</h6>

              <div className="small mb-3">
                <div className="text-muted">Employee Code</div>
                <div className="fw-semibold">
                  {myProfile?.employeeCode || "-"}
                </div>
              </div>

              <div className="small mb-3">
                <div className="text-muted">Role</div>
                <div className="fw-semibold">
                  {myProfile?.role || "-"}
                </div>
              </div>

              <div className="small mb-3">
                <div className="text-muted">Employment Type</div>
                <div className="fw-semibold">
                  {myProfile?.employmentType || "-"}
                </div>
              </div>

              <div className="small mb-3">
                <div className="text-muted">Salary</div>
                <div className="fw-semibold">
                  {myProfile?.salary
                    ? `₹ ${Number(myProfile.salary).toLocaleString()}`
                    : "-"}
                </div>
              </div>

              <div className="small">
                <div className="text-muted">Joining Date</div>
                <div className="fw-semibold">
                  {myProfile?.joiningDate
                    ? new Date(myProfile.joiningDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;