import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIn,
  checkOut,
  fetchMyAttendance,
} from "../../features/attendance/attendanceSlice";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";

const Attendance = () => {
  const dispatch = useDispatch();

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState(searchParams.get("status") || "");

  useEffect(() => {
    const urlStatus = searchParams.get("status") || "";
    setStatus(urlStatus);
    setPage(1); // reset page when filter changes
  }, [searchParams]);

  const { records, loading, actionLoading, error, total, totalPages, limit } =
    useSelector((state) => state.attendance);

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

  // ✅ ADD THIS (IMPORTANT)
  const isCheckedIn = Boolean(todayRecord?.checkIn);
  const isCheckedOut = Boolean(todayRecord?.checkOut);

  // ✅ FIXED
  const onCheckIn = async () => {
    const res = await dispatch(checkIn());

    if (res.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyAttendance({ month, page, status }));
    }
  };

  // ✅ FIXED
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
    <div>
      {/* HEADER */}
      <div className="mb-3">
        <h6 className="fw-semibold text-dark mb-0">My Attendance</h6>
      </div>

      {/* ✅ ERROR LIKE SETTINGS */}
      {error && (
        <div className="alert alert-danger py-2 small">
          <p className="mb-0">{error}</p>
        </div>
      )}

      {/* TODAY CARD */}
      <div className="card shadow border-0 mb-3">
        <div className="card-body text-center py-3">
          <h6 className="fw-semibold mb-3">Today</h6>

          {todayRecord ? (
            <div className="row g-2 mb-3 small">
              <div className="col-md-3">
                <div className="text-muted">Date</div>
                <div className="fw-semibold">
                  {new Date(todayRecord.date).toLocaleDateString()}
                </div>
              </div>

              <div className="col-md-3">
                <div className="text-muted">Check In</div>
                <div className="fw-semibold text-success">
                  {todayRecord.checkIn
                    ? new Date(todayRecord.checkIn).toLocaleTimeString()
                    : "-"}
                </div>
              </div>

              <div className="col-md-3">
                <div className="text-muted">Check Out</div>
                <div className="fw-semibold text-warning">
                  {todayRecord.checkOut
                    ? new Date(todayRecord.checkOut).toLocaleTimeString()
                    : "-"}
                </div>
              </div>

              <div className="col-md-3">
                <div className="text-muted">Hours</div>
                <div className="fw-semibold">
                  {formatHours(todayRecord.workingHours)}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted small mb-3">
              No attendance record for today
            </p>
          )}

          <div className="d-flex justify-content-center gap-2">
            {/* ✅ DISABLED LOGIC */}
            <button
              className="btn btn-primary btn-sm"
              onClick={onCheckIn}
              disabled={actionLoading || isCheckedIn}
            >
              {actionLoading ? "..." : "Check In"}
            </button>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onCheckOut}
              disabled={actionLoading || !isCheckedIn || isCheckedOut}
            >
              Check Out
            </button>
          </div>

          {/* ✅ INFO MESSAGE */}
          {isCheckedIn && !isCheckedOut && (
            <div className="alert alert-info py-2 small mt-2">
              <p className="mb-0">
                Auto checkout is enabled. Only check out if you want early leave
                or half day.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FILTER */}
      <div className="card shadow border-0 mb-3">
        <div className="card-body py-2">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small mb-1">Month</label>
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
              <label className="form-label small mb-1">Status</label>
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

            <div className="col-md-2 d-flex">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => {
                  setMonth(getCurrentMonth());
                  setStatus("");
                  setSearchParams({}); // ✅ IMPORTANT
                  setPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE (unchanged except status already added) */}
      <div className="card shadow border-0">
        <div className="card-body py-2">
          {loading ? (
            <p className="mb-0 small">Loading attendance...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm align-middle text-center">
                <thead className="table-light">
                  <tr className="small">
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
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
                      <td colSpan="5" className="text-muted py-2 small">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && (
          <div className="card-footer bg-white border-0 py-2">
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0 small text-muted">
                Showing {total === 0 ? 0 : (page - 1) * limit + 1}–
                {total === 0 ? 0 : Math.min(page * limit, total)} of {total}
              </p>

              {total > limit && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
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

export default Attendance;
