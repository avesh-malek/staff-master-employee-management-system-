import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIn, checkOut, fetchMyAttendance } from "../../features/attendance/attendanceSlice";

const Attendance = () => {
  const dispatch = useDispatch();
  const [month, setMonth] = useState("");

  const { records, loading, actionLoading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchMyAttendance(month));
  }, [dispatch, month]);

  const todayRecord = useMemo(() => {
    const today = new Date().toDateString();
    return records.find((item) => new Date(item.date).toDateString() === today);
  }, [records]);

  const onCheckIn = async () => {
    await dispatch(checkIn());
    dispatch(fetchMyAttendance(month));
  };

  const onCheckOut = async () => {
    await dispatch(checkOut());
    dispatch(fetchMyAttendance(month));
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">My Attendance</h3>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h5 className="fw-bold mb-3">Today's Attendance</h5>
          {todayRecord ? (
            <div className="row mb-3">
              <div className="col-md-3"><p className="text-muted mb-1">Date</p><h6>{new Date(todayRecord.date).toLocaleDateString()}</h6></div>
              <div className="col-md-3"><p className="text-muted mb-1">Check In</p><h6 className="text-success">{todayRecord.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString() : "-"}</h6></div>
              <div className="col-md-3"><p className="text-muted mb-1">Check Out</p><h6 className="text-warning">{todayRecord.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString() : "-"}</h6></div>
              <div className="col-md-3"><p className="text-muted mb-1">Working Hours</p><h6>{todayRecord.workingHours || 0}</h6></div>
            </div>
          ) : (
            <p className="text-muted">No attendance record for today yet.</p>
          )}

          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary" onClick={onCheckIn} disabled={actionLoading}>Check In</button>
            <button className="btn btn-outline-primary" onClick={onCheckOut} disabled={actionLoading}>Check Out</button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">
            <div className="col-md-4">
              <label className="form-label">Select Month</label>
              <input type="month" className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p className="mb-0">Loading attendance...</p>
          ) : (
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</td>
                    <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</td>
                    <td>{record.workingHours || 0}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan="4" className="text-muted">No attendance records found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
