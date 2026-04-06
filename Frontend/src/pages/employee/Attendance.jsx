import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIn,
  checkOut,
  fetchMyAttendance,
} from "../../features/attendance/attendanceSlice";
import { exportMyAttendance } from "../../features/attendanceExport/attendanceExportSlice";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import AttendancePolicyModal from "../../components/AttendancePolicyModal";

const Attendance = () => {
  const dispatch = useDispatch();

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPolicy, setShowPolicy] = useState(false);

  const [status, setStatus] = useState(searchParams.get("status") || "");

  useEffect(() => {
    const urlStatus = searchParams.get("status") || "";
    setStatus(urlStatus);
    setPage(1);
  }, [searchParams]);

  const { records, loading, actionLoading, error, total, totalPages, limit } =
    useSelector((state) => state.attendance);

  const { employeeLoading: exportLoading, error: exportError } = useSelector(
    (state) => state.attendanceExport
  );

  useEffect(() => {
    dispatch(fetchMyAttendance({ month, page, status }));
  }, [dispatch, month, page, status]);

  const todayRecord = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return records.find((item) => {
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  }, [records]);

  const isCheckedIn = Boolean(todayRecord?.checkIn);
  const isCheckedOut = Boolean(todayRecord?.checkOut);

  const onCheckIn = async () => {
    const res = await dispatch(checkIn());
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyAttendance({ month, page, status }));
    }
  };

  const onCheckOut = async () => {
    if (!isCheckedIn) return;
    const res = await dispatch(checkOut());
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyAttendance({ month, page, status }));
    }
  };

  const formatHours = (hours) => {
    if (!hours) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="container-fluid px-0">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold mb-0">My Attendance</h6>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowPolicy(true)}
          >
            Policy
          </button>

          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => dispatch(exportMyAttendance({ month, status }))}
            disabled={exportLoading}
          >
            {exportLoading ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {/* ERRORS */}
      {error && (
        <div className="alert alert-danger py-1 small mb-2">{error}</div>
      )}

      {exportError && (
        <div className="alert alert-danger py-1 small mb-2">{exportError}</div>
      )}

      {/* TODAY CARD (COMPACT) */}
      <div className="card border-0 shadow-sm mb-2">
        <div className="card-body py-2 text-center">

          <div className="small fw-semibold mb-2">Today</div>

          {todayRecord ? (
            <div className="d-flex justify-content-between small text-muted mb-2">
              <span>{new Date(todayRecord.date).toLocaleDateString()}</span>
              <span className="text-success">
                {todayRecord.checkIn
                  ? new Date(todayRecord.checkIn).toLocaleTimeString()
                  : "-"}
              </span>
              <span className="text-warning">
                {todayRecord.checkOut
                  ? new Date(todayRecord.checkOut).toLocaleTimeString()
                  : "-"}
              </span>
              <span>{formatHours(todayRecord.workingHours)}</span>
            </div>
          ) : (
            <div className="small text-muted mb-2">
              No record for today
            </div>
          )}

          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary btn-sm px-3"
              onClick={onCheckIn}
              disabled={actionLoading || isCheckedIn}
            >
              {actionLoading ? "..." : "Check In"}
            </button>

            <button
              className="btn btn-outline-primary btn-sm px-3"
              onClick={onCheckOut}
              disabled={actionLoading || !isCheckedIn || isCheckedOut}
            >
              Check Out
            </button>
          </div>

          {isCheckedIn && !isCheckedOut && (
            <div className="small text-info mt-1">
              Auto checkout is enabled. Only check out if you want early leave
            </div>
          )}
        </div>
      </div>

      {/* FILTER (SMALL) */}
      <div className="card border-0 shadow-sm mb-2">
        <div className="card-body py-2">
          <div className="row g-2 align-items-end">

            <div className="col-md-3">
              <input
                type="month"
                className="form-control form-control-sm"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatus(value);
                  setSearchParams(value ? { status: value } : {});
                  setPage(1);
                }}
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

            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => {
                  setMonth(getCurrentMonth());
                  setStatus("");
                  setSearchParams({});
                  setPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-body py-2">

          {loading ? (
            <p className="small mb-0">Loading...</p>
          ) : (
            <div className="table-responsive">

              <table className="table table-sm align-middle text-center mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Date</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className="small">
                  {records.map((record) => (
                    <tr key={record._id}>
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

                      <td>
                        {record.status?.base === "present" && (
                          <span className="badge bg-success">Present</span>
                        )}
                        {record.status?.base === "present_late" && (
                          <span className="badge bg-warning text-dark">
                            Present (Late)
                          </span>
                        )}
                        {record.status?.base === "present_grace" && (
                          <span className="badge bg-info">
                            Present (Grace Late)
                          </span>
                        )}
                        {record.status?.modifiers?.includes("half_day") && (
                          <span className="badge bg-primary">Half Day</span>
                        )}
                        {record.status?.modifiers?.includes("early_leave") && (
                          <span className="badge bg-warning">Early Leave</span>
                        )}
                        {record.status?.base === "absent" && (
                          <span className="badge bg-dark">Absent</span>
                        )}
                        {record.status?.base === "not_checked_in" && (
                          <span className="badge bg-secondary">
                            Not Checked-In
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {records.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-muted small py-2">
                        No records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          )}
        </div>

        {!loading && (
          <div className="card-footer bg-white py-2 small d-flex justify-content-between">
            <span>
              Showing {total === 0 ? 0 : (page - 1) * limit + 1}–
              {total === 0 ? 0 : Math.min(page * limit, total)} of {total}
            </span>

            {total > limit && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </div>
        )}
      </div>

      {/* POLICY MODAL */}
      {showPolicy && (
        <AttendancePolicyModal onClose={() => setShowPolicy(false)} />
      )}
    </div>
  );
};

export default Attendance;