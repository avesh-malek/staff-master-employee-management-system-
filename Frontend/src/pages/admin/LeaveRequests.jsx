import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchLeaves,
  updateLeaveStatus,
  fetchAdminLeaveUnreadCount,
} from "../../features/leave/leaveSlice";

const badgeClass = (status) => {
  if (status === "approved") return "bg-success";
  if (status === "rejected") return "bg-danger";
  return "bg-warning text-dark";
};

const getDays = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const formatDays = (days) => {
  if (days >= 14) return `${days} \uD83D\uDD34`;
  if (days >= 7) return `${days} \uD83D\uDFE0`;
  return `${days}`;
};

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [monthFilter, setMonthFilter] = useState(
    searchParams.get("month") || "",
  );
  const [page, setPage] = useState(1);
  const {
    requests: leaves,
    loading,
    actionLoading,
    error,
    total,
    limit,
    totalPages,
  } = useSelector((state) => state.leave);

  useEffect(() => {
    const nextParams = {};
    if (statusFilter) nextParams.status = statusFilter;
    if (monthFilter) nextParams.month = monthFilter;
    setSearchParams(nextParams);
  }, [monthFilter, setSearchParams, statusFilter]);

  useEffect(() => {
    dispatch(
      fetchLeaves({
        status: statusFilter,
        month: monthFilter,
        page,
      }),
    );
  }, [dispatch, monthFilter, page, statusFilter]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleAction = async (id, status) => {
    await dispatch(updateLeaveStatus({ id, status })).unwrap();
    dispatch(fetchLeaves({ status: statusFilter, month: monthFilter, page }));
    dispatch(fetchAdminLeaveUnreadCount());
  };

  const showPagination = total > limit;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(page * limit, total);

  const maxVisiblePages = 5;

  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  return (
    <div>
      <h6 className="mb-3 fw-semibold text-dark">Leave Requests</h6>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-3">
              <label className="form-label small mb-1">Month</label>
              <input
                type="month"
                className="form-control form-control-sm"
                value={monthFilter}
                onChange={(event) => {
                  setMonthFilter(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="mb-0 small">Loading leave requests...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm align-middle text-center">
                <thead className="table-light small">
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th className="text-start" style={{ width: "200px" }}>
                      Reason
                    </th>
                    <th>Status</th>
                    <th style={{ width: "140px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody className="small">
                  {leaves.map((leave) => {
                    const days = getDays(leave.fromDate, leave.toDate);
                    return (
                      <tr
                        key={leave._id}
                        className={
                          leave.status === "pending" ? "table-warning" : ""
                        }
                      >
                        <td className="fw-semibold">{leave.employee?.name}</td>

                        <td>{leave.leaveType}</td>

                        <td>{new Date(leave.fromDate).toLocaleDateString()}</td>

                        <td>{new Date(leave.toDate).toLocaleDateString()}</td>

                        <td>{formatDays(days)}</td>

                        <td
                          className="text-start"
                          style={{ maxWidth: "200px", whiteSpace: "normal" }}
                        >
                          {leave.reason}
                        </td>

                        <td>
                          <span
                            className={`badge ${badgeClass(
                              leave.status,
                            )} px-2 py-1`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td>
                          {leave.status === "pending" ? (
                            <div className="d-flex justify-content-center gap-1">
                              <button
                                className="btn btn-sm text-white px-2 py-0"
                                style={{
                                  fontSize: "12px",
                                  backgroundColor: "#198754",
                                  border: "none",
                                }}
                                onClick={() =>
                                  handleAction(leave._id, "approved")
                                }
                                disabled={actionLoading}
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-sm text-white px-2 py-0"
                                style={{
                                  fontSize: "12px",
                                  backgroundColor: "#dc3545",
                                  border: "none",
                                }}
                                onClick={() =>
                                  handleAction(leave._id, "rejected")
                                }
                                disabled={actionLoading}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {leaves.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-muted py-3">
                        No leave requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (
            <div className="d-flex align-items-center justify-content-between mt-2">
              <p className="mb-0 small text-muted">
                Showing {start}-{end} of {total}
              </p>

              {showPagination && (
                <ul className="pagination pagination-sm justify-content-end mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {startPage > 1 && (
                    <>
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => setPage(1)}
                        >
                          1
                        </button>
                      </li>

                      {startPage > 2 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                    </>
                  )}

                  {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const pageNumber = startPage + i;

                    return (
                      <li
                        key={pageNumber}
                        className={`page-item ${pageNumber === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}

                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}

                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => setPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
