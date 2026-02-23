import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { approveAllLeaves } from "../../features/leave/leaveSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 Read data from Redux
  const employees = useSelector((state) => state.employees.list);
  const leaves = useSelector((state) => state.leave.requests);
  const attendance = useSelector((state) => state.attendance.records);

  const handleApproveAll = () => {
    if (pendingLeaves === 0) return;

    if (window.confirm("Approve all pending leave requests?")) {
      dispatch(approveAllLeaves());
    }
  };

  // 🔹 Derived values
  const totalEmployees = employees.length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending",
  ).length;

  const totalAttendance = attendance.filter(
    (a) => a.status === "Present",
  ).length;

  const totalPayroll = employees.reduce(
    (sum, emp) => sum + (emp.salary || 0),
    0,
  );

  return (
    <div>
      <h3 className="mb-4 fw-bold">Admin Dashboard</h3>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Total Employees</h6>
              <h3 className="fw-bold text-primary">{totalEmployees}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Pending Leaves</h6>
              <h3 className="fw-bold text-warning">{pendingLeaves}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Total Attendance</h6>
              <h3 className="fw-bold text-success">{totalAttendance}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Payroll</h6>
              <h3 className="fw-bold text-danger">
                ₹{totalPayroll.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Manage Employees</h5>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate("/admin/add-employee")}
              >
                Add Employee
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/employees")}
              >
                View Employees
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Manage Leaves</h5>
              <button
                className="btn btn-outline-warning me-2"
                onClick={() => navigate("/admin/leave-requests")}
              >
                View Leave Requests
              </button>
              <button
                className="btn btn-outline-success"
                disabled={pendingLeaves === 0}
                onClick={handleApproveAll}
              >
                Approve All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
