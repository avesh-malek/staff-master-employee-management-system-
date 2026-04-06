import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  fetchAdminAttendance,
  fetchAttendancePolicy,
} from "../../features/attendance/attendanceSlice";
import { exportAdminAttendance } from "../../features/attendanceExport/attendanceExportSlice";
import EmployeeAutocomplete from "../../components/EmployeeAutocomplete";
import Pagination from "../../components/Pagination";

const getTodayValue = () => new Date().toISOString().split("T")[0];

const formatHours = (hours) => {
  if (!hours) return "-";
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);

  const { list: employees } = useSelector((state) => state.employees);
  const {
    adminRecords,
    adminLoading,
    error,
    adminTotal,
    adminTotalPages,
    adminLimit,
    policy,
    policyLoading,
  } = useSelector((state) => state.attendance);
  const { adminLoading: exportLoading, error: exportError } = useSelector(
    (state) => state.attendanceExport,
  );

  const statusParam = searchParams.get("status") || "";
  const [filters, setFilters] = useState({
    employeeId: "",
    date: "",
    from: "",
    to: "",
    department: "",
    status: statusParam,
  });
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAttendancePolicy());
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchAdminAttendance({
          ...filters,
          page,
          limit: 10,
        }),
      );
    }, 200);

    return () => clearTimeout(timeoutId);
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
    setFilters((prev) => ({ ...prev, status: statusParam }));
    setPage(1);
  }, [statusParam]);

  const departments = useMemo(
    () => [
      ...new Set(employees.map((item) => item.department).filter(Boolean)),
    ],
    [employees],
  );

  const isDateDisabled = Boolean(filters.from || filters.to);
  const isRangeDisabled = Boolean(filters.date);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "date" && value) {
        next.from = "";
        next.to = "";
      }

      if ((name === "from" || name === "to") && value) {
        next.date = "";
      }

      return next;
    });

    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      employeeId: "",
      date: "",
      from: "",
      to: "",
      department: "",
      status: "",
    });
    setEmployeeQuery("");
    setSelectedEmployee(null);
    setSearchParams({});
    setPage(1);
  };

  const handleEmployeeInputChange = (value) => {
    setEmployeeQuery(value);
    setSelectedEmployee(null);
    setFilters((prev) => ({ ...prev, employeeId: "" }));
    setPage(1);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeQuery(`${employee.name} (${employee.employeeCode})`);
    setFilters((prev) => ({ ...prev, employeeId: employee._id }));
    setPage(1);
  };

  const renderStatus = (record) => (
    <div className="d-flex flex-wrap gap-1 justify-content-center">
      {record.status?.base === "present" && (
        <span className="badge bg-success">Present</span>
      )}
      {record.status?.base === "present_late" && (
        <span className="badge bg-warning text-dark">Present (Late)</span>
      )}
      {record.status?.base === "present_grace" && (
        <span className="badge bg-info">Present (Grace Late)</span>
      )}
      {record.status?.base === "absent" && (
        <span className="badge bg-dark">Absent</span>
      )}
      {record.status?.base === "not_checked_in" && (
        <span className="badge bg-secondary">Not Checked-In</span>
      )}
      {record.status?.modifiers?.includes("half_day") && (
        <span className="badge bg-primary">Half Day</span>
      )}
      {record.status?.modifiers?.includes("early_leave") && (
        <span className="badge bg-warning">Early Leave</span>
      )}
    </div>
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
        <h6 className="mb-0 fw-semibold text-dark">Attendance Management</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => dispatch(exportAdminAttendance(filters))}
            disabled={exportLoading}
          >
            {exportLoading ? "Exporting..." : "Export Excel"}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/admin/attendance/settings")}
          >
            Attendance Settings
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}
      {exportError && (
        <div className="alert alert-danger py-2 small">{exportError}</div>
      )}

      <div className="card shadow border-0 mb-3">
  <div className="card-body py-1 px-2">
    <div
      className="d-flex align-items-end gap-1"
      style={{ flexWrap: "nowrap", overflowX: "auto" }}
    >

      <div style={{ minWidth: "180px" }}>
        <label className="form-label small mb-0">Emp</label>
        <EmployeeAutocomplete
          token={token}
          value={employeeQuery}
          selectedEmployee={selectedEmployee}
          onChange={handleEmployeeInputChange}
          onSelect={handleEmployeeSelect}
          onClear={() => {
            setEmployeeQuery("");
            setSelectedEmployee(null);
            setFilters((prev) => ({ ...prev, employeeId: "" }));
            setPage(1);
          }}
        />
      </div>

      {/* Date */}
      <div style={{ width: "120px" }}>
        <label className="form-label small mb-0">Date</label>
        <input
          className="form-control form-control-sm py-1"
          type="date"
          name="date"
          max={getTodayValue()}
          value={filters.date}
          onChange={handleFilterChange}
          disabled={isDateDisabled}
        />
      </div>

      {/* From */}
      <div style={{ width: "120px" }}>
        <label className="form-label small mb-0">From</label>
        <input
          className="form-control form-control-sm py-1"
          type="date"
          name="from"
          max={filters.to || getTodayValue()}
          value={filters.from}
          onChange={handleFilterChange}
          disabled={isRangeDisabled}
        />
      </div>

      {/* To */}
      <div style={{ width: "120px" }}>
        <label className="form-label small mb-0">To</label>
        <input
          className="form-control form-control-sm py-1"
          type="date"
          name="to"
          min={filters.from || undefined}
          max={getTodayValue()}
          value={filters.to}
          onChange={handleFilterChange}
          disabled={isRangeDisabled}
        />
      </div>

      {/* Status */}
      <div style={{ width: "140px" }}>
        <label className="form-label small mb-0">Status</label>
        <select
          className="form-select form-select-sm py-1"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="present">Present</option>
          <option value="present_late">Late</option>
          <option value="present_grace">Grace</option>
          <option value="half_day">Half</option>
          <option value="early_leave">Early</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      {/* Reset */}
      <div style={{ minWidth: "80px" }}>
        <button
          className="btn btn-outline-secondary btn-sm py-1 px-2 w-100"
          onClick={clearFilters}
        >
          Reset
        </button>
      </div>

    </div>

    {!filters.date && !(filters.from && filters.to) && (
      <p className="small text-muted mt-1 mb-0">
        Default: current date
      </p>
    )}
  </div>
</div>

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
                      <td>{new Date(record.date).toLocaleDateString()}</td>
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
                      <td>{renderStatus(record)}</td>
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
                Showing {adminTotal === 0 ? 0 : (page - 1) * adminLimit + 1}-
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
