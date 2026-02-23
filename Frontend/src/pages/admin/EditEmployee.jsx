import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateEmployee } from "../../features/employees/employeeSlice";

const EditEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // EMP001

  // 🔹 Get employee from Redux
  const employee = useSelector((state) =>
    state.employees.list.find((e) => e.id === id)
  );

  // 🔹 Local form state (prefilled)
  const [formData, setFormData] = useState(
    employee || {}
  );

  if (!employee) {
    return <p>Employee not found</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Redux update (backend later)
    dispatch(updateEmployee(formData));

    navigate("/admin/employees");
  };

  return (
    <div>
      <button
        className="btn btn-link mb-3"
        onClick={() => navigate("/admin/employees")}
      >
        ← Back to Employees
      </button>

      <h3 className="fw-bold mb-1">Edit Employee</h3>
      <p className="text-muted mb-4">Employee ID: {id}</p>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-md-4">
                <label className="form-label">Employee ID</label>
                <input
                  className="form-control"
                  value={formData.id}
                  disabled
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Department</label>
                <input
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Designation</label>
                <input
                  name="designation"
                  className="form-control"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Salary</label>
                <input
                  name="salary"
                  type="number"
                  className="form-control"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option>Employee</option>
                  <option>HR</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="col-md-8">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Profile Pic – backend later */}
              <div className="col-md-4">
                <label className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  disabled
                />
                <small className="text-muted">
                  Will be enabled after backend
                </small>
              </div>

              <div className="col-12 text-end mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate("/admin/employees")}
                >
                  Cancel
                </button>
                <button className="btn btn-primary">
                  Update Employee
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
