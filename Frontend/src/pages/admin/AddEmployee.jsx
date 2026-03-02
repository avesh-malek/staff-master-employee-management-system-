import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../../features/employees/employeeSlice";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  department: "",
  designation: "",
  employmentType: "Full-time",
  salary: "",
  joiningDate: "",
  role: "employee",
  employmentStatus: true,
};

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actionLoading, error } = useSelector((state) => state.employees);
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      salary: Number(form.salary),
      employmentStatus:
        form.employmentStatus === "false" ? false : Boolean(form.employmentStatus),
    };

    const result = await dispatch(createEmployee(payload));
    if (!result.error) navigate("/admin/employees");
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Add Employee</h3>

      <div className="card shadow-sm">
        <div className="card-body">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Employment Type</label>
                <select
                  className="form-select"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Intern">Intern</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Employment Status</label>
                <select
                  className="form-select"
                  name="employmentStatus"
                  value={String(form.employmentStatus)}
                  onChange={handleChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="col-md-8">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
