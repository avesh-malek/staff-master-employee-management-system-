import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaves } from "../../features/leave/leaveSlice";
import { fetchMyEmployee } from "../../features/employees/employeeSlice";
import { fetchMyAttendance } from "../../features/attendance/attendanceSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { myProfile } = useSelector((state) => state.employees);
  const { records: attendance } = useSelector((state) => state.attendance);
  const { requests: leaves } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchMyEmployee());
    dispatch(fetchLeaves());
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  const presentDays = attendance.filter((item) => item.checkIn).length;
  const absentDays = 0;
  const leavesTaken = leaves.filter(
    (leave) => leave.status === "approved",
  ).length;

  return (
    <div>
      <h3 className="mb-4 fw-bold">Employee Dashboard</h3>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Present Days</h6>
              <h3 className="fw-bold text-success">{presentDays}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h6 className="text-muted">Absent Days</h6>
              <h3 className="fw-bold text-danger">{absentDays}</h3>
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
                Rs{" "}
                {myProfile?.salary
                  ? Number(myProfile.salary).toLocaleString()
                  : "-"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">My Profile</h5>
              <p className="text-muted mb-1">
                Name: {myProfile?.name || user?.name}
              </p>
              <p className="text-muted mb-1">
                Department: {myProfile?.department || "-"}
              </p>
              <p className="text-muted mb-0">
                Code: {myProfile?.employeeCode || "-"}
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
