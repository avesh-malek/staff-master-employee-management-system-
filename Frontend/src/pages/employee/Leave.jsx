import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLeave, fetchLeaves } from "../../features/leave/leaveSlice";
import Pagination from "../../components/Pagination";

const badgeClass = (status) => {
  if (status === "approved") return "bg-success";
  if (status === "rejected") return "bg-danger";
  return "bg-warning text-dark";
};

const getDays = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const Leave = () => {
  const dispatch = useDispatch();

  const {
    requests: leaves,
    loading,
    actionLoading,
    error,
    total,
    limit,
    totalPages,
  } = useSelector((state) => state.leave);

  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "casual",
    reason: "",
  });

  useEffect(() => {
    dispatch(fetchLeaves({ page }));
  }, [dispatch, page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(createLeave(form));

    if (!result.error) {
      setForm({
        fromDate: "",
        toDate: "",
        leaveType: "casual",
        reason: "",
      });
      dispatch(fetchLeaves({ page }));
    }
  };

  const showPagination = total > limit;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <div>
      {/* TITLE */}
      <h6 className="mb-3 fw-semibold text-dark">My Leaves</h6>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body">

          {/* FORM (COMPACT LIKE ADMIN FILTERS) */}
          <form onSubmit={handleSubmit}>
            <div className="row g-2 mb-3">

              <div className="col-md-2">
                <label className="form-label small mb-1">From</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small mb-1">To</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small mb-1">Type</label>
                <select
                  className="form-select form-select-sm"
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                >
                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small mb-1">Reason</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-sm btn-primary w-100"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Applying..." : "Apply"}
                </button>
              </div>

            </div>
          </form>

          {/* TABLE */}
          {loading ? (
            <p className="mb-0 small">Loading leaves...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm align-middle text-center">
                <thead className="table-light small">
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Type</th>
                    <th className="text-start" style={{ width: "200px" }}>
                      Reason
                    </th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className="small">
                  {leaves.map((leave) => {
                    const days = getDays(
                      leave.fromDate,
                      leave.toDate
                    );

                    return (
                      <tr key={leave._id}>
                        <td>
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </td>

                        <td>
                          {new Date(leave.toDate).toLocaleDateString()}
                        </td>

                        <td>{days}</td>

                        <td className="text-capitalize">
                          {leave.leaveType}
                        </td>

                        <td
                          className="text-start"
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "normal",
                          }}
                        >
                          {leave.reason}
                        </td>

                        <td>
                          <span
                            className={`badge ${badgeClass(leave.status)} px-2 py-1`}
                            style={{ textTransform: "capitalize" }}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {leaves.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-muted py-3">
                        No leaves found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && (
            <div className="d-flex align-items-center justify-content-between mt-2">
              <p className="mb-0 small text-muted">
                Showing {start}-{end} of {total}
              </p>

              {showPagination && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Leave;