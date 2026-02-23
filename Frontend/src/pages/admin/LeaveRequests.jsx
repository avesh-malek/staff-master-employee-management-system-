
import { useDispatch, useSelector } from "react-redux";
import { updateLeaveStatus } from "../../features/leave/leaveSlice";


const LeaveRequests = () => {


  const leaves = useSelector(state => state.leave.requests);
const dispatch = useDispatch();

const handleAction = (id, status) => {
  dispatch(updateLeaveStatus({ id, status }));
};


  return (
    <div>
      <h3 className="mb-4 fw-bold">Leave Requests</h3>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.name}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.fromDate}</td>
                  <td>{leave.toDate}</td>
                  <td>{leave.description}</td>
                  <td>
                    {leave.status === "Pending" && (
                      <span className="badge bg-warning">{leave.status}</span>
                    )}
                    {leave.status === "Approved" && (
                      <span className="badge bg-success">{leave.status}</span>
                    )}
                    {leave.status === "Rejected" && (
                      <span className="badge bg-danger">{leave.status}</span>
                    )}
                  </td>
                  <td>
                    {leave.status === "Pending" ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleAction(leave.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAction(leave.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
