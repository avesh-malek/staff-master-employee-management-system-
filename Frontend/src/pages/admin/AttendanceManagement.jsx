import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import { fetchAdminAttendance } from "../../features/attendance/attendanceSlice";

const AttendanceManagement = () => {
  const dispatch = useDispatch();

  const { list: employees } = useSelector((state) => state.employees);
  const { adminRecords, adminLoading, error } = useSelector((state) => state.attendance);

  const [filters, setFilters] = useState({
    employeeId: "",
    date: "",
    department: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminAttendance(filters));
  }, [dispatch, filters]);

  const departments = useMemo(() => {
    return [...new Set(employees.map((item) => item.department).filter(Boolean))];
  }, [employees]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      employeeId: "",
      date: "",
      department: "",
    });
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Attendance Management</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Employee</label>
              <select
                className="form-select"
                name="employeeId"
                value={filters.employeeId}
                onChange={handleChange}
              >
                <option value="">All employees</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} ({employee.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                className="form-control"
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                name="department"
                value={filters.department}
                onChange={handleChange}
              >
                <option value="">All departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {adminLoading ? (
            <p className="mb-0">Loading attendance records...</p>
          ) : (
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {adminRecords.map((record) => (
                  <tr key={record._id}>
                    <td>
                      {record.employee?.name} ({record.employee?.employeeCode})
                    </td>
                    <td>{record.employee?.department || "-"}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</td>
                    <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</td>
                    <td>{record.workingHours || 0}</td>
                  </tr>
                ))}
                {adminRecords.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
