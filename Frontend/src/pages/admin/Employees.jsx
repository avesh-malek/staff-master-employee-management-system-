import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteEmployee, fetchEmployees } from "../../features/employees/employeeSlice";
import { toAssetUrl } from "../../services/api";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: employees, loading, error, actionLoading } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    await dispatch(deleteEmployee(id));
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Employee List</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p className="mb-0">Loading employees...</p>
          ) : (
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Employment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.employeeCode}</td>

                    <td
                      className="text-start d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/employee/${emp._id}`)}
                    >
                      <img
                        src={emp.profilePic ? toAssetUrl(emp.profilePic) : DEFAULT_AVATAR}
                        alt="profile"
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                      {emp.name}
                    </td>

                    <td>{emp.department}</td>
                    <td>{emp.employmentType}</td>
                    <td>
                      <span className={`badge ${emp.isActive ? "bg-success" : "bg-danger"}`}>
                        {emp.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-info me-1"
                        onClick={() => navigate(`/admin/employee/${emp._id}`)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => navigate(`/admin/employees/edit/${emp._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(emp._id)}
                        disabled={actionLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
