import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeById } from "../../features/employees/employeeSlice";
import { toAssetUrl } from "../../services/api";

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

  return (
    <div>
      <button className="btn btn-link mb-3" onClick={() => navigate("/admin/employees")}>Back to Employees</button>

      <h3 className="mb-4 fw-bold">Employee Profile</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-column align-items-center text-center">
          <img
            src={employee.profilePic ? toAssetUrl(employee.profilePic) : "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
            alt={employee.name}
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h5 className="fw-bold">{employee.name}</h5>
          <p className="text-muted">{employee.designation} - {employee.department}</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body">
            <h5 className="fw-bold mb-3">Personal Information</h5>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Address:</strong> {employee.address || "-"}</p>
          </div></div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body">
            <h5 className="fw-bold mb-3">Job Information</h5>
            <p><strong>Employee Code:</strong> {employee.employeeCode}</p>
            <p><strong>Role:</strong> {employee.role}</p>
            <p><strong>Employment:</strong> {employee.employmentType}</p>
            <p>
              <strong>Employment Status:</strong>{" "}
              <span
                className={`badge ${
                  employee.employmentStatus === false ? "bg-danger" : "bg-success"
                }`}
              >
                {employee.employmentStatus === false ? "Inactive" : "Active"}
              </span>
            </p>
            <p><strong>Salary:</strong> Rs {employee.salary?.toLocaleString()}</p>
            <p><strong>Joining Date:</strong> {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "-"}</p>
          </div></div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
