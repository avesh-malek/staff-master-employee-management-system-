import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeById } from "../../features/employees/employeeSlice";
import { toAssetUrl } from "../../services/api";

const getStatusMeta = (status) => {
  if (status === "inactive") return { label: "Inactive", badge: "bg-warning text-dark" };
  if (status === "terminated") return { label: "Terminated", badge: "bg-danger" };
  if (status === "on_leave") return { label: "On Leave", badge: "bg-info text-dark" };
  return { label: "Active", badge: "bg-success" };
};

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { selected: employee, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);

  if (loading && (!employee || employee._id !== id)) return <p>Loading employee...</p>;
  if (error && (!employee || employee._id !== id)) return <p>{error}</p>;
  if (!employee || employee._id !== id) return <p>Employee not found</p>;
  const status = getStatusMeta(employee.user?.employmentStatus);

  return (
    <div>
  {/* HEADER */}
  <div className="d-flex align-items-center justify-content-between mb-3">
    <h6 className="fw-semibold text-dark mb-0">Employee Profile</h6>

    <button
      className="btn btn-outline-secondary btn-sm"
      onClick={() => navigate("/admin/employees")}
    >
      ← Back
    </button>
  </div>

  {/* PROFILE CARD */}
  <div className="card shadow border-0 mb-3">
    <div className="card-body py-3 text-center">
      <img
        src={
          employee.profilePic
            ? toAssetUrl(employee.profilePic)
            : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
        }
        alt={employee.name}
        className="rounded-circle mb-2"
        style={{
          width: "140px",   // 🔥 increased size
          height: "140px",
          objectFit: "cover",
        }}
      />

      <div className="fw-semibold">{employee.name}</div>
      <div className="text-muted small">
        {employee.designation} • {employee.department}
      </div>
    </div>
  </div>

  {/* DETAILS */}
  <div className="row g-3">
    
    {/* PERSONAL */}
    <div className="col-md-6">
      <div className="card shadow border-0 h-100">
        <div className="card-body py-3">
          <h6 className="fw-semibold mb-3">Personal</h6>

          <div className="small mb-2">
            <span className="text-muted">Email:</span><br />
            {employee.email}
          </div>

          <div className="small mb-2">
            <span className="text-muted">Phone:</span><br />
            {employee.phone}
          </div>

          <div className="small">
            <span className="text-muted">Address:</span><br />
            {employee.address || "-"}
          </div>
        </div>
      </div>
    </div>

    {/* JOB */}
    <div className="col-md-6">
      <div className="card shadow border-0 h-100">
        <div className="card-body py-3">
          <h6 className="fw-semibold mb-3">Job</h6>

          <div className="small mb-2">
            <span className="text-muted">Employee Code:</span><br />
            {employee.employeeCode}
          </div>

          <div className="small mb-2">
            <span className="text-muted">Role:</span><br />
            {employee.role}
          </div>

          <div className="small mb-2">
            <span className="text-muted">Employment:</span><br />
            {employee.employmentType}
          </div>

          <div className="small mb-2">
            <span className="text-muted">Status:</span><br />
            <span className={`badge ${status.badge}`}>
              {status.label}
            </span>
          </div>

          <div className="small mb-2">
            <span className="text-muted">Salary:</span><br />
            ₹ {employee.salary?.toLocaleString()}
          </div>

          <div className="small">
            <span className="text-muted">Joining Date:</span><br />
            {employee.joiningDate
              ? new Date(employee.joiningDate).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
  );
};

export default EmployeeProfile;
