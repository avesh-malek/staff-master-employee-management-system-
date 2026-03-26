import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import {
  fetchLeaves,
  updateLeaveStatus,
  fetchAdminLeaveUnreadCount,
} from "../../features/leave/leaveSlice";
import { fetchAttendanceDashboard } from "../../features/attendance/attendanceSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: employees } = useSelector((state) => state.employees);
  const { requests: leaves, unreadCount } = useSelector((state) => state.leave);
  const { dashboard } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 1000 }));
    dispatch(fetchLeaves());
    dispatch(fetchAttendanceDashboard());
  }, [dispatch]);

  const pendingLeaves = unreadCount;

  const handleApproveAll = async () => {
    const pendingLeaveItems = leaves.filter(
      (leave) => leave.status === "pending",
    );

    if (!pendingLeaveItems.length) return;

    if (!window.confirm("Approve all pending leave requests?")) return;

    await Promise.all(
      pendingLeaveItems.map((leave) =>
        dispatch(
          updateLeaveStatus({
            id: leave._id,
            status: "approved",
          }),
        ),
      ),
    );

    dispatch(fetchLeaves({ page: 1 }));
    dispatch(fetchAdminLeaveUnreadCount());
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (item) => item.user?.employmentStatus === "active",
  ).length;

  const totalPayroll = employees.reduce(
    (sum, emp) => sum + (Number(emp.salary) || 0),
    0,
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Admin Dashboard</h4>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          Overview of employees, payroll and leave activity
        </p>
      </div>

      <div className="row g-4 mb-4">
        {[
          {
            title: "Total Employees",
            value: totalEmployees,
            color: "primary",
            route: "/admin/employees",
          },
          {
            title: "Active Employees",
            value: activeEmployees,
            color: "success",
            route: "/admin/employees?status=active",
          },
          {
            title: "Pending Leaves",
            value: pendingLeaves > 10 ? "10+" : pendingLeaves,
            color: "warning",
            route: "/admin/leaves",
          },
          {
            title: "Payroll",
            value: `Rs ${totalPayroll.toLocaleString()}`,
            color: "danger",
            route: null,
          },
        ].map((card, index) => (
          <div className="col-md-3" key={index}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ cursor: card.route ? "pointer" : "default" }}
              onClick={() => card.route && navigate(card.route)}
            >
              <div className="card-body">
                <h6 className="text-muted mb-2" style={{ fontSize: "13px" }}>
                  {card.title}
                </h6>
                <h3 className={`fw-bold text-${card.color} mb-0`}>
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <h6 className="text-muted mb-0">Attendance Overview</h6>
      </div>

      <div className="row g-4 mb-4">
        {[
          {
            title: "Total Employees",
            value: dashboard.totalEmployees,
            color: "primary",
            route: "/admin/attendance", // optional
          },
          {
            title: "Present",
            value: dashboard.present,
            color: "success",
            route: "/admin/attendance?status=present",
          },
          {
            title: "Late",
            value: dashboard.late,
            color: "warning",
            route: "/admin/attendance?status=late",
          },
          {
            title: "Not Checked-In",
            value: dashboard.notCheckedIn,
            color: "secondary",
            route: "/admin/attendance?status=not_checked_in",
          },
          {
            title: "Absent",
            value: dashboard.absent,
            color: "danger",
            route: "/admin/attendance?status=absent",
          },
        ].map((card, index) => (
          <div className="col" key={`attendance-${index}`}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ cursor: card.route ? "pointer" : "default" }}
              onClick={() => card.route && navigate(card.route)}
            >
              <div className="card-body">
                <h6 className="text-muted mb-2" style={{ fontSize: "13px" }}>
                  {card.title}
                </h6>
                <h3 className={`fw-bold text-${card.color} mb-0`}>
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Manage Employees</h5>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/admin/add-employee")}
                >
                  Add Employee
                </button>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate("/admin/employees")}
                >
                  View Employees
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Manage Leaves</h5>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate("/admin/leaves")}
                >
                  View Leave Requests
                </button>

                <button
                  className="btn btn-success btn-sm"
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
    </div>
  );
};

export default Dashboard;
