import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const employee = useSelector((state) =>
    state.employees.list.find((e) => e.id === user.id)
  );

  const attendance = useSelector((state) => state.attendance.summary);
  const leavesTaken = useSelector((state) => state.leave.summary.taken);

  return (
    <div>
      <h3 className="mb-4 fw-bold">Employee Dashboard</h3>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Present Days</h6>
              <h3 className="fw-bold text-success">{attendance.present}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Absent Days</h6>
              <h3 className="fw-bold text-danger">{attendance.absent}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Leaves Taken</h6>
              <h3 className="fw-bold text-warning">{leavesTaken}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Salary</h6>
              <h3 className="fw-bold text-primary">
                ₹{employee.salary.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">My Profile</h5>
              <p className="text-muted mb-1">Name: {employee.name}</p>
              <p className="text-muted mb-1">
                Department: {employee.department}
              </p>
              <p className="text-muted mb-0">
                Role: {employee.designation}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate("/employee/leave")}
              >
                Apply Leave
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/employee/attendance")}
              >
                View Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
