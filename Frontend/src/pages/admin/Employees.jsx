import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteEmployee } from "../../features/employees/employeeSlice";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.list);

  const handleView = (id) => navigate(`/admin/employee/${id}`);
  const handleEdit = (id) => navigate(`/admin/employees/edit/${id}`);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(id));
    }
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Employee List</h3>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>

                  <td
                    className="text-start d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleView(emp.id)}
                  >
                    <img
                      src={DEFAULT_AVATAR}
                      alt="profile"
                      className="rounded-circle me-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    {emp.name}
                  </td>

                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>

                  <td>
                    <span
                      className={`badge ${
                        emp.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-1"
                      onClick={() => handleView(emp.id)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(emp.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(emp.id)}
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
        </div>
      </div>
    </div>
  );
};

export default Employees;
