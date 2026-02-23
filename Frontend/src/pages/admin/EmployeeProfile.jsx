import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmployeeProfile = () => {
  const navigate = useNavigate()
  const { id } = useParams();

  const employee = useSelector((state) =>
    state.employees.list.find((e) => e.id === id)
  );

  if (!employee) {
    return <p>Employee not found</p>;
  }

  return (
    <div>
       <button
        className="btn btn-link mb-3"
        onClick={() => navigate("/admin/employees")}
      >
        ← Back to Employees
      </button>

      <h3 className="mb-4 fw-bold">Employee Profile</h3>

      {/* Profile Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-column align-items-center text-center">
          <img
            src={employee.profilePic || "/assets/user-placeholder.png"}
            alt={employee.name}
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h5 className="fw-bold">{employee.name}</h5>
          <p className="text-muted">
            {employee.designation} - {employee.department}
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Personal Information</h5>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Phone:</strong> {employee.phone}</p>
              <p><strong>Address:</strong> {employee.address}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Job Information</h5>
              <p><strong>Employee ID:</strong> {employee.id}</p>
              <p><strong>Role:</strong> {employee.role}</p>
              <p><strong>Salary:</strong> ₹{employee.salary}</p>
              <p><strong>Joining Date:</strong> {employee.joiningDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
