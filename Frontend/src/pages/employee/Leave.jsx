import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLeave, fetchLeaves } from "../../features/leave/leaveSlice";

const Leave = () => {
  const dispatch = useDispatch();
  const { requests: leaves, loading, actionLoading, error } = useSelector((state) => state.leave);

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "casual",
    reason: "",
  });

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createLeave(form));
    if (!result.error) {
      setForm({ fromDate: "", toDate: "", leaveType: "casual", reason: "" });
      dispatch(fetchLeaves());
    }
  };

  const getBadgeClass = (status) => {
    if (status === "approved") return "bg-success";
    if (status === "rejected") return "bg-danger";
    return "bg-warning text-dark";
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">My Leave</h3>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm mb-4"><div className="card-body">
        <h5 className="mb-3">Apply for Leave</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">From Date</label><input type="date" className="form-control" name="fromDate" value={form.fromDate} onChange={handleChange} required /></div>
            <div className="col-md-4"><label className="form-label">To Date</label><input type="date" className="form-control" name="toDate" value={form.toDate} onChange={handleChange} required /></div>
            <div className="col-md-4"><label className="form-label">Leave Type</label><select className="form-select" name="leaveType" value={form.leaveType} onChange={handleChange}><option value="casual">Casual Leave</option><option value="sick">Sick Leave</option><option value="paid">Paid Leave</option><option value="unpaid">Unpaid Leave</option></select></div>
            <div className="col-12"><label className="form-label">Reason</label><textarea className="form-control" rows="3" name="reason" value={form.reason} onChange={handleChange} required /></div>
            <div className="col-12 text-end"><button className="btn btn-primary" type="submit" disabled={actionLoading}>{actionLoading ? "Submitting..." : "Apply Leave"}</button></div>
          </div>
        </form>
      </div></div>

      <div className="card shadow-sm"><div className="card-body">
        <h5 className="mb-3">Leave History</h5>
        {loading ? (
          <p className="mb-0">Loading leave history...</p>
        ) : (
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light"><tr><th>From</th><th>To</th><th>Type</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.reason}</td>
                  <td><span className={`badge ${getBadgeClass(leave.status)}`}>{leave.status}</span></td>
                </tr>
              ))}
              {leaves.length === 0 && <tr><td colSpan="5" className="text-muted">No leave history found</td></tr>}
            </tbody>
          </table>
        )}
      </div></div>
    </div>
  );
};

export default Leave;
