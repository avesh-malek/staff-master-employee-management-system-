import { useEffect, useMemo } from "react";
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

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    dispatch(fetchMyEmployee());
    dispatch(fetchLeaves());
    dispatch(fetchMyAttendance({ month: currentMonth, page: 1, limit: 1000 }));
  }, [dispatch, currentMonth]);

  // ✅ CALCULATIONS (IMPORTANT)
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let grace = 0;
    let halfDay = 0;
    let earlyLeave = 0;
    let absent = 0;

    attendance.forEach((item) => {
      const base = item.status?.base;
      const modifiers = item.status?.modifiers || [];

      if (["present", "present_late", "present_grace"].includes(base)) {
        present++;
      }

      if (base === "present_late") late++;
      if (base === "present_grace") grace++;

      if (modifiers.includes("half_day")) halfDay++;
      if (modifiers.includes("early_leave")) earlyLeave++;

      if (base === "absent") absent++;
    });

    return { present, late, grace, halfDay, earlyLeave, absent };
  }, [attendance]);

  const leavesTaken = leaves.filter(
    (leave) => leave.status === "approved",
  ).length;

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Employee Dashboard</h4>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          Overview of your attendance and activity
        </p>
      </div>

      {/* ATTENDANCE CARDS (ADMIN STYLE) */}
      <div className="mb-3">
        <h6 className="text-muted mb-0">Attendance Overview</h6>
      </div>

      <div className="row g-4 mb-4">
        {[
          {
            title: "Present",
            value: stats.present,
            color: "success",
            route: "/employee/attendance?status=all_present",
          },
          {
            title: "Late",
            value: stats.late,
            color: "warning",
            route: "/employee/attendance?status=present_late",
          },
          {
            title: "Grace Late",
            value: stats.grace,
            color: "info",
            route: "/employee/attendance?status=present_grace",
          },
          {
            title: "Half Day",
            value: stats.halfDay,
            color: "primary",
            route: "/employee/attendance?status=half_day",
          },
          {
            title: "Early Leave",
            value: stats.earlyLeave,
            color: "warning",
            route: "/employee/attendance?status=early_leave",
          },
          {
            title: "Absent",
            value: stats.absent,
            color: "danger",
            route: "/employee/attendance?status=absent",
          },
        ].map((card, index) => (
          <div className="col" key={index}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(card.route)}
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

      {/* OTHER CARDS */}
      <div className="row g-4 mb-4">
        {[
          {
            title: "Leaves Taken",
            value: leavesTaken,
            color: "warning",
            route: "/employee/leave",
          },
          {
            title: "Salary",
            value: myProfile?.salary
              ? `Rs ${Number(myProfile.salary).toLocaleString()}`
              : "-",
            color: "primary",
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

      {/* PROFILE + ACTIONS */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">My Profile</h5>
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
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Quick Actions</h5>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/employee/leave")}
                >
                  Apply Leave
                </button>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate("/employee/attendance")}
                >
                  View Attendance
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
