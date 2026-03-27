import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import {
  fetchAdminAttendance,
  fetchAttendancePolicy,
} from "../../features/attendance/attendanceSlice";
import Pagination from "../../components/Pagination";
const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const formatHours = (hours) => {
    if (!hours) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };
  const { list: employees } = useSelector((state) => state.employees);
  const {
    adminRecords,
    adminLoading,
    error,
    adminTotal,
    adminTotalPages,
    adminLimit,
  } = useSelector((state) => state.attendance);

  const statusParam = searchParams.get("status") || "";
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date().toISOString().split("T")[0]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const [filters, setFilters] = useState({
    employeeId: "",
    date: today,
    department: "",
    status: statusParam,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAdminAttendance({
        ...filters,
        page,
        limit: 10,
      }),
    );
  }, [dispatch, filters, page]);

  useEffect(() => {
    if (adminTotalPages > 0 && page > adminTotalPages) {
      setPage(adminTotalPages);
    }
  }, [adminTotalPages, page]);

  useEffect(() => {
    const nextParams = {};
    if (filters.status) nextParams.status = filters.status;
    setSearchParams(nextParams);
  }, [filters.status, setSearchParams]);

  useEffect(() => {
    if (statusParam) {
      setFilters((prev) => ({ ...prev, status: statusParam }));
    }
  }, []);

  useEffect(() => {
    const todayNow = new Date().toISOString().split("T")[0];

    setFilters((prev) => ({
      ...prev,
      date: todayNow,
    }));
  }, []);

  const departments = useMemo(() => {
    return [
      ...new Set(employees.map((item) => item.department).filter(Boolean)),
    ];
  }, [employees]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      employeeId: "",
      date: today, // ✅ keep today
      department: "",
      status: "",
    });
    setPage(1);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="mb-0 fw-semibold text-dark">Attendance Management</h6>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/admin/attendance/settings")}
        >
          ⚙️ Settings
        </button>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {/* FILTERS */}
      <div className="card shadow border-0 mb-3">
        <div className="card-body py-2">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small mb-1">Employee</label>
              <select
                className="form-select form-select-sm"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleChange}
              >
                <option value="">All</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small mb-1">Date</label>
              <input
                className="form-control form-control-sm"
                type="date"
                name="date"
                max={today}
                value={filters.date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label small mb-1">Department</label>
              <select
                className="form-select form-select-sm"
                name="department"
                value={filters.department}
                onChange={handleChange}
              >
                <option value="">All</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                name="status"
                value={filters.status}
                onChange={handleChange}
              >
                <option value="">All</option>
                <option value="all_present">All Present</option>
                <option value="present">Present</option>
                <option value="present_late">Present (Late)</option>
                <option value="present_grace">Present (Grace Late)</option>
                <option value="half_day">Half Day</option>
                <option value="early_leave">Early Leave</option>
                <option value="absent">Absent</option>
                <option value="not_checked_in">Not Checked-In</option>
              </select>
            </div>

            {/* RESET BUTTON FIXED */}
            <div className="col-md-2 d-flex">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={clearFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow border-0">
        <div className="card-body py-2">
          {adminLoading ? (
            <p className="mb-0 small">Loading attendance...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm align-middle text-center">
                <thead className="table-light">
                  <tr className="small">
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className="small">
                  {adminRecords.map((record) => (
                    <tr key={record._id}>
                      <td>
                        {record.employee?.name} ({record.employee?.employeeCode}
                        )
                      </td>

                      <td>
                        {record.date
                          ? new Date(record.date).toLocaleDateString()
                          : filters.date}
                      </td>

                      <td>
                        {record.checkIn
                          ? new Date(record.checkIn).toLocaleTimeString()
                          : "-"}
                      </td>

                      <td>
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleTimeString()
                          : "-"}
                      </td>

                      <td>{formatHours(record.workingHours)}</td>

                      <td>
                        {record.status === "present" && (
                          <span className="badge bg-success">Present</span>
                        )}

                        {record.status === "present_late" && (
                          <span className="badge bg-warning text-dark">
                            Present (Late)
                          </span>
                        )}

                        {record.status === "present_grace" && (
                          <span className="badge bg-info">
                            Present (Grace Late)
                          </span>
                        )}

                        {record.status === "half_day" && (
                          <span className="badge bg-primary">Half Day</span>
                        )}

                        {record.status === "early_leave" && (
                          <span className="badge bg-warning">Early Leave</span>
                        )}

                        {record.status === "absent" && (
                          <span className="badge bg-dark">Absent</span>
                        )}

                        {record.status === "not_checked_in" && (
                          <span className="badge bg-secondary">
                            Not Checked-In
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {adminRecords.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-muted py-2 small">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!adminLoading && (
          <div className="card-footer bg-white border-0 py-2">
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0 small text-muted">
                Showing {adminTotal === 0 ? 0 : (page - 1) * adminLimit + 1}–
                {adminTotal === 0 ? 0 : Math.min(page * adminLimit, adminTotal)}{" "}
                of {adminTotal}
              </p>

              {adminTotal > adminLimit && (
                <Pagination
                  page={page}
                  totalPages={adminTotalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;
