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
  const status = getStatusMeta(myProfile?.user?.employmentStatus);

  useEffect(() => {
    dispatch(fetchMyEmployee());
  }, [dispatch]);

  const handleUpload = async () => {
    if (!file) return;
    const result = await dispatch(uploadMyProfilePicture(file));
    if (!result.error) setFile(null);
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">My Profile</h3>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-center mb-4">
                <img
                  src={
                    myProfile?.profilePic
                      ? toAssetUrl(myProfile.profilePic)
                      :
                    "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                  }
                  alt="Profile"
                  className="rounded-circle mb-2"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <h5 className="mb-0">{myProfile?.name || user?.name || "-"}</h5>
                <small className="text-muted">{myProfile?.designation || user?.role || "-"}</small>

                <div className="mt-2 d-flex justify-content-center gap-2">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    style={{ maxWidth: "260px" }}
                  />
                  <button className="btn btn-sm btn-outline-primary" onClick={handleUpload} disabled={actionLoading || !file}>
                    {actionLoading ? "Uploading..." : "Update Photo"}
                  </button>
                </div>
              </div>

              <hr />

              <div className="row mb-3">
                <div className="col-sm-6"><label className="text-muted">Employee Code</label><p className="fw-semibold">{myProfile?.employeeCode || "-"}</p></div>
                <div className="col-sm-6"><label className="text-muted">Department</label><p className="fw-semibold">{myProfile?.department || "-"}</p></div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6"><label className="text-muted">Email</label><p className="fw-semibold">{myProfile?.email || user?.email || "-"}</p></div>
                <div className="col-sm-6"><label className="text-muted">Joining Date</label><p className="fw-semibold">{myProfile?.joiningDate ? new Date(myProfile.joiningDate).toLocaleDateString() : "-"}</p></div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6"><label className="text-muted">Salary</label><p className="fw-semibold">{myProfile?.salary ? `Rs ${Number(myProfile.salary).toLocaleString()}` : "-"}</p></div>
                <div className="col-sm-6"><label className="text-muted">Employment Status</label><span className={`badge ${status.badge}`}>{status.label}</span></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
