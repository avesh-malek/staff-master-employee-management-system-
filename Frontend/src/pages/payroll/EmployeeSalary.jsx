import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import {
  clearPayrollMessage,
  downloadPayrollPayslip,
  fetchMyPayroll,
} from "../../features/payroll/payrollSlice";

const monthLabel = (month, year) =>
  new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

const currency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusBadgeClass = (status) => {
  if (status === "paid") return "bg-success";
  if (status === "pending") return "bg-danger";
  return "bg-secondary";
};

const EmployeeSalary = () => {
  const dispatch = useDispatch();
  const {
    myRecords,
    myPage,
    myLimit,
    myTotal,
    myTotalPages,
    myLoading,
    downloadLoadingId,
    error,
    successMessage,
  } = useSelector((state) => state.payroll);

  const [filters, setFilters] = useState({
    period: "",
    status: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const [year, month] = filters.period ? filters.period.split("-") : [];

    dispatch(
      fetchMyPayroll({
        page,
        limit: 10,
        month,
        year,
        status: filters.status,
      }),
    );
  }, [dispatch, filters.period, filters.status, page]);

  // auto clear messages
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearPayrollMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearPayrollMessage());
    };
  }, [dispatch]);

  return (
    <div className="container-fluid" style={{ fontSize: "13px" }}>
      {/* HEADER */}
      <div className="mb-3">
        <h5 className="fw-semibold mb-1">My Salary</h5>
        <p className="text-muted small mb-0">
          Review salary history & download payslips
        </p>
      </div>

      {error && <div className="alert alert-danger py-1">{error}</div>}
      {successMessage && (
        <div className="alert alert-success py-1">{successMessage}</div>
      )}

      {/* FILTER */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-2 row g-2">
          <div className="col-md-4">
            <input
              type="month"
              className="form-control form-control-sm"
              value={filters.period}
              onChange={(e) => {
                setFilters((p) => ({ ...p, period: e.target.value }));
                setPage(1);
              }}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={filters.status}
              onChange={(e) => {
                setFilters((p) => ({ ...p, status: e.target.value }));
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="col-md-4">
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => {
                setFilters({ period: "", status: "" });
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-2">
          {myLoading ? (
            <p className="small mb-0">Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Month</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {myRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{monthLabel(record.month, record.year)}</td>
                      <td>{currency(record.netSalary)}</td>

                      <td>
                        <span className={`badge ${statusBadgeClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>

                      <td className="small">
                        {record.paymentDate
                          ? new Date(record.paymentDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={
                            record.status !== "paid" ||
                            downloadLoadingId === record._id
                          }
                          onClick={() => dispatch(downloadPayrollPayslip(record._id))}
                        >
                          {downloadLoadingId === record._id
                            ? "Downloading..."
                            : "PDF"}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {myRecords.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-muted py-3 small">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!myLoading && (
          <div className="card-footer p-2 bg-white">
            <Pagination
              page={myPage}
              totalPages={myTotalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSalary;
