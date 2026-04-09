import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import {
  bulkDownloadPayslips,
  clearPayrollMessage,
  downloadPayrollPayslip,
  fetchAdminPayroll,
  generatePayroll,
  payPayroll,
} from "../../features/payroll/payrollSlice";

const getCurrentPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (month, year) =>
  new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

const currency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusBadgeClass = (status) => {
  if (status === "paid") return "bg-success";
  if (status === "pending") return "bg-danger";
  return "bg-secondary";
};

const AdminPayroll = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  const {
    adminRecords,
    adminPage,
    adminLimit,
    adminTotal,
    adminTotalPages,
    loading,
    actionLoading,
    downloadLoadingId,
    bulkDownloading,
    error,
    successMessage,
    summary,
  } = useSelector((state) => state.payroll);

  const [period, setPeriod] = useState(getCurrentPeriod());
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    period: "",
    status: "",
    search: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    payrollId: "",
    employeeName: "",
    paymentMethod: "bank_transfer",
     paymentDate: "",
    transactionId: "",
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
      setPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const [year, month] = filters.period ? filters.period.split("-") : [];

    dispatch(
      fetchAdminPayroll({
        page,
        limit: 10,
        month,
        year,
        status: filters.status,
        search: filters.search,
      }),
    );
  }, [dispatch, filters.period, filters.search, filters.status, page]);

  useEffect(() => {
    return () => {
      dispatch(clearPayrollMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    const sectionId =
      tab === "generate"
        ? "payroll-generate"
        : tab === "records"
          ? "payroll-records"
          : "payroll-dashboard";

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [tab]);

  const handleGenerate = async () => {
    const [year, month] = period.split("-");
    const result = await dispatch(
      generatePayroll({ month: Number(month), year: Number(year) }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(
        fetchAdminPayroll({
          page,
          limit: 10,
          month: filters.period ? filters.period.split("-")[1] : "",
          year: filters.period ? filters.period.split("-")[0] : "",
          status: filters.status,
          search: filters.search,
        }),
      );
    }
  };

  const handlePay = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      payPayroll({
        id: paymentForm.payrollId,
        payload: {
  paymentMethod: paymentForm.paymentMethod,
  ...(paymentForm.paymentDate && { paymentDate: paymentForm.paymentDate }),
  ...(paymentForm.transactionId && { transactionId: paymentForm.transactionId }),
},
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setPaymentForm({
        payrollId: "",
        employeeName: "",
        paymentMethod: "bank_transfer",
         paymentDate: "",
        transactionId: "",
      });
    }
  };

  return (
    <div className="container-fluid" style={{ fontSize: "13px" }}>
      {/* HEADER */}
      <div className="mb-3">
        <h5 className="fw-semibold mb-1">Payroll</h5>
        <p className="text-muted small mb-0">
          Manage salary, payments & payslips
        </p>
      </div>

      {error && <div className="alert alert-danger py-1">{error}</div>}
      {successMessage && (
        <div className="alert alert-success py-1">{successMessage}</div>
      )}

      {/* DASHBOARD */}
      <div className="row g-2 mb-3" id="payroll-dashboard">
        {[
          ["Total Salary", currency(summary?.totalSalary), "text-primary"],
          ["Paid", summary?.paid, "text-success"],
          ["Pending", summary?.pending, "text-danger"],
          ["Records", adminTotal, "text-dark"],
        ].map(([label, value, color], i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-2">
                <small className="text-muted">{label}</small>
                <div className={`fw-semibold ${color}`}>{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GENERATE */}
      <div className="card border-0 shadow-sm mb-3" id="payroll-generate">
        <div className="card-body p-2 d-flex flex-wrap gap-2 align-items-end">
          <div>
            <label className="small">Salary Period</label>
            <input
              type="month"
              className="form-control form-control-sm"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>

          <button
            className="btn btn-sm btn-primary"
            onClick={handleGenerate}
            disabled={actionLoading}
          >
            {actionLoading ? "Generating..." : "Generate"}
          </button>

          <button
            className="btn btn-sm btn-outline-success"
            disabled={bulkDownloading}
            onClick={() => {
              const [year, month] = filters.period
                ? filters.period.split("-")
                : [null, null];

              dispatch(
                bulkDownloadPayslips({
                  ...(month && { month: Number(month) }),
                  ...(year && { year: Number(year) }),
                  ...(filters.status && { status: filters.status }),
                  ...(filters.search && { search: filters.search }),
                }),
              );
            }}
          >
            Bulk PDF
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="card border-0 shadow-sm mb-3" id="payroll-records">
        <div className="card-body p-2 row g-2">
          <div className="col-md-3">
            <input
              type="month"
              className="form-control form-control-sm"
              value={filters.period}
              onChange={(e) =>
                setFilters((p) => ({ ...p, period: e.target.value }))
              }
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters((p) => ({ ...p, status: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              className="form-control form-control-sm"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => {
                setFilters({ period: "", status: undefined, search: "" });
                setSearchInput("");
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
          {loading ? (
            <p className="small mb-0">Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Month</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {adminRecords.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div className="fw-semibold small">
                          {record.employee?.name}
                        </div>
                        <div className="text-muted small">
                          {record.employee?.email}
                        </div>
                      </td>

                      <td>{monthLabel(record.month, record.year)}</td>
                      <td>{currency(record.netSalary)}</td>

                      <td>
                        <span
                          className={`badge ${statusBadgeClass(record.status)}`}
                        >
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
                          className="btn btn-sm btn-outline-primary me-1"
                          disabled={record.status === "paid"}
                          onClick={() =>
                            setPaymentForm({
                              payrollId: record._id,
                              employeeName: record.employee?.name || "",
                              paymentMethod: "bank_transfer",
                              paymentDate: "",
                              transactionId: "",
                            })
                          }
                        >
                          Mark as Paid
                        </button>

                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={
                            record.status !== "paid" ||
                            downloadLoadingId === record._id
                          }
                          onClick={() =>
                            dispatch(downloadPayrollPayslip(record._id))
                          }
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && (
          <div className="card-footer p-2 bg-white">
            <Pagination
              page={adminPage}
              totalPages={adminTotalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* MODAL (UNCHANGED LOGIC) */}
      {paymentForm.payrollId && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handlePay}>
                <div className="modal-header py-2">
                  <h6 className="modal-title">Mark as Paid</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setPaymentForm({
                        payrollId: "",
                        employeeName: "",
                        paymentMethod: "bank_transfer",
                        paymentDate: "",
                        transactionId: "",
                      })
                    }
                  />
                </div>

                <div className="modal-body p-2">
                  <p className="small mb-2">{paymentForm.employeeName}</p>

                  <select
                    className="form-select form-select-sm mb-2"
                    value={paymentForm.paymentMethod}
                    onChange={(e) =>
                      setPaymentForm((p) => ({
                        ...p,
                        paymentMethod: e.target.value,
                      }))
                    }
                  >
                    <option value="bank_transfer">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                  </select>

                  <input
                    type="date"
                    className="form-control form-control-sm mb-2"
                    value={paymentForm.paymentDate}
                    onChange={(e) =>
                      setPaymentForm((p) => ({
                        ...p,
                        paymentDate: e.target.value,
                      }))
                    }
                  />

                  <input
                    className="form-control form-control-sm"
                    placeholder="Transaction ID"
                    value={paymentForm.transactionId}
                    onChange={(e) =>
                      setPaymentForm((p) => ({
                        ...p,
                        transactionId: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="modal-footer py-2">
                  <button type="submit" className="btn btn-sm btn-primary">
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setPaymentForm({ payrollId: "" })}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayroll;
