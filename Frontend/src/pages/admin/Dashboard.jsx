import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import { fetchLeaves, updateLeaveStatus } from "../../features/leave/leaveSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: employees } = useSelector((state) => state.employees);
  const { requests: leaves } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchLeaves());
  }, [dispatch]);

  const pendingLeaveItems = leaves.filter((leave) => leave.status === "pending");

  const handleApproveAll = async () => {
    if (!pendingLeaveItems.length) return;
    if (!window.confirm("Approve all pending leave requests?")) return;

    await Promise.all(
      pendingLeaveItems.map((leave) =>
        dispatch(updateLeaveStatus({ id: leave._id, status: "approved" }))
      )
    );

    dispatch(fetchLeaves());
  };

  const totalEmployees = employees.length;
  const employmentStatus = employees.filter((item) => item.employmentStatus !== false).length;
  const pendingLeaves = pendingLeaveItems.length;
  const totalPayroll = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);

  return (
    <div>
      <h3 className="mb-4 fw-bold">Admin Dashboard</h3>

      <div className="row g-4 mb-4">
        <div className="col-md-3"><div className="card shadow-sm text-center"><div className="card-body"><h6 className="text-muted">Total Employees</h6><h3 className="fw-bold text-primary">{totalEmployees}</h3></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm text-center"><div className="card-body"><h6 className="text-muted">Employment Status</h6><h3 className="fw-bold text-success">{employmentStatus}</h3></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm text-center"><div className="card-body"><h6 className="text-muted">Pending Leaves</h6><h3 className="fw-bold text-warning">{pendingLeaves}</h3></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm text-center"><div className="card-body"><h6 className="text-muted">Payroll</h6><h3 className="fw-bold text-danger">Rs {totalPayroll.toLocaleString()}</h3></div></div></div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body text-center">
            <h5 className="card-title mb-3">Manage Employees</h5>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate("/admin/add-employee")}>Add Employee</button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/employees")}>View Employees</button>
          </div></div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm"><div className="card-body text-center">
            <h5 className="card-title mb-3">Manage Leaves</h5>
            <button className="btn btn-outline-warning me-2" onClick={() => navigate("/admin/leaves")}>View Leave Requests</button>
            <button className="btn btn-outline-success" disabled={pendingLeaves === 0} onClick={handleApproveAll}>Approve All</button>
          </div></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
