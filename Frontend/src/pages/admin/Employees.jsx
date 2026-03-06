import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  deleteEmployee,
  fetchEmployees,
} from "../../features/employees/employeeSlice";
import { toAssetUrl } from "../../services/api";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState("all");

  const {
    list: employees,
    loading,
    error,
    actionLoading,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());

    const statusFromUrl = searchParams.get("status");
    if (statusFromUrl) {
      setStatusFilter(statusFromUrl);
    } else {
      setStatusFilter("all");
    }
  }, [dispatch, searchParams]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    await dispatch(deleteEmployee(id));
  };

  const filteredEmployees =
    statusFilter === "all"
      ? employees
      : employees.filter(
          (emp) => emp.user?.employmentStatus === statusFilter
        );

  return (
    <div>
      <h6 className="mb-2 fw-semibold text-dark">Employee List</h6>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        {["all", "active", "inactive", "on_leave", "terminated"].map(
          (status) => (
            <button
              key={status}
              className={`btn btn-sm ${
                statusFilter === status
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setStatusFilter(status)}
              style={{ textTransform: "capitalize" }}
            >
              {status.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow border-0">
        <div className="card-body">
          {loading ? (
            <p className="mb-0">Loading employees...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm align-middle">
                <thead className="table-light">
                  <tr className="text-center small">
                    <th style={{ width: "90px" }}>Code</th>
                    <th className="text-start">Employee</th>
                    <th>Dept</th>
                    <th>Role</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th style={{ width: "160px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody className="small">
                  {filteredEmployees.map((emp) => {
                    const status =
                      emp.user?.employmentStatus || "inactive";

                    const statusColor =
                      status === "active"
                        ? "success"
                        : status === "on_leave"
                        ? "warning"
                        : status === "terminated"
                        ? "danger"
                        : "secondary";

                    return (
                      <tr key={emp._id} className="text-center">
                        <td className="fw-semibold">
                          {emp.employeeCode}
                        </td>

                        <td
                          className="text-start"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/admin/employee/${emp._id}`)
                          }
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                emp.profilePic
                                  ? toAssetUrl(emp.profilePic)
                                  : DEFAULT_AVATAR
                              }
                              alt="profile"
                              className="rounded-circle me-2"
                              style={{
                                width: "32px",
                                height: "32px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <div className="fw-semibold">
                                {emp.name}
                              </div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "12px" }}
                              >
                                {emp.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{emp.department}</td>
                        <td>{emp.designation}</td>
                        <td>{emp.employmentType}</td>

                        <td>
                          <span
                            className={`badge bg-${statusColor} px-2 py-1`}
                          >
                            {status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn btn-outline-primary btn-sm px-2 py-0"
                              style={{ fontSize: "12px" }}
                              onClick={() =>
                                navigate(`/admin/employee/${emp._id}`)
                              }
                            >
                              View
                            </button>

                            <button
                              className="btn btn-outline-secondary btn-sm px-2 py-0"
                              style={{ fontSize: "12px" }}
                              onClick={() =>
                                navigate(
                                  `/admin/employees/edit/${emp._id}`
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm px-2 py-0"
                              style={{ fontSize: "12px" }}
                              onClick={() =>
                                handleDelete(emp._id)
                              }
                              disabled={actionLoading}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-muted py-3"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;