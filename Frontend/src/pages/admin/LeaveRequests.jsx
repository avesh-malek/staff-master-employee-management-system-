import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaves, updateLeaveStatus } from "../../features/leave/leaveSlice";

const badgeClass = (status) => {
  if (status === "approved") return "bg-success";
  if (status === "rejected") return "bg-danger";
  return "bg-warning text-dark";
};

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { requests: leaves, loading, actionLoading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  const handleAction = async (id, status) => {
    await dispatch(updateLeaveStatus({ id, status }));
    dispatch(fetchLeaves());
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Leave Requests</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p className="mb-0">Loading leave requests...</p>
          ) : (
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.employee?.name}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td><span className={`badge ${badgeClass(leave.status)}`}>{leave.status}</span></td>
                    <td>
                      {leave.status === "pending" ? (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => handleAction(leave._id, "approved")} disabled={actionLoading}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleAction(leave._id, "rejected")} disabled={actionLoading}>Reject</button>
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr><td colSpan="7" className="text-muted">No leave requests found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
