import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createEmployee,
  clearFieldError,
} from "../../features/employees/employeeSlice";

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
  employmentStatus: "active",
};

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actionLoading, error, validationErrors } = useSelector(
    (state) => state.employees,
  );
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    dispatch(clearFieldError(name));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
    };

    const result = await dispatch(createEmployee(payload));
    if (!result.error) navigate("/admin/employees");
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <h5 className="fw-bold mb-1">Add Employee</h5>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          Fill in employee details below
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Name */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className={`form-control shadow-sm ${validationErrors?.name ? "is-invalid" : ""}`}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                {validationErrors?.name && (
                  <div className="invalid-feedback">
                    {validationErrors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className={`form-control shadow-sm ${validationErrors?.email ? "is-invalid" : ""}`}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {validationErrors?.email && (
                  <div className="invalid-feedback">
                    {validationErrors.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="tel"
                  className={`form-control shadow-sm ${validationErrors?.phone ? "is-invalid" : ""}`}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                {validationErrors?.phone && (
                  <div className="invalid-feedback">
                    {validationErrors.phone}
                  </div>
                )}
              </div>

              {/* Department */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Department</label>
                <input
                  type="text"
                  className={`form-control shadow-sm ${validationErrors?.department ? "is-invalid" : ""}`}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />
                {validationErrors?.department && (
                  <div className="invalid-feedback">
                    {validationErrors.department}
                  </div>
                )}
              </div>

              {/* Designation */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Designation</label>
                <input
                  type="text"
                  className={`form-control shadow-sm ${validationErrors?.designation ? "is-invalid" : ""}`}
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                />
                {validationErrors?.designation && (
                  <div className="invalid-feedback">
                    {validationErrors.designation}
                  </div>
                )}
              </div>

              {/* Employment Type */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Employment Type
                </label>
                <select
                  className={`form-select shadow-sm ${validationErrors?.employmentType ? "is-invalid" : ""}`}
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Intern">Intern</option>
                  <option value="Contract">Contract</option>
                </select>
                {validationErrors?.employmentType && (
                  <div className="invalid-feedback">
                    {validationErrors.employmentType}
                  </div>
                )}
              </div>

              {/* Salary */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Salary</label>
                <input
                  type="number"
                  className={`form-control shadow-sm ${validationErrors?.salary ? "is-invalid" : ""}`}
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                />
                {validationErrors?.salary && (
                  <div className="invalid-feedback">
                    {validationErrors.salary}
                  </div>
                )}
              </div>

              {/* Joining Date */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Joining Date</label>
                <input
                  type="date"
                  className={`form-control shadow-sm ${validationErrors?.joiningDate ? "is-invalid" : ""}`}
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                />
                {validationErrors?.joiningDate && (
                  <div className="invalid-feedback">
                    {validationErrors.joiningDate}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className={`form-select shadow-sm ${validationErrors?.role ? "is-invalid" : ""}`}
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
                {validationErrors?.role && (
                  <div className="invalid-feedback">
                    {validationErrors.role}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Employment Status
                </label>
                <select
                  className={`form-select shadow-sm ${validationErrors?.employmentStatus ? "is-invalid" : ""}`}
                  name="employmentStatus"
                  value={form.employmentStatus}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                  <option value="on_leave">On Leave</option>
                </select>
                {validationErrors?.employmentStatus && (
                  <div className="invalid-feedback">
                    {validationErrors.employmentStatus}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="col-md-8">
                <label className="form-label fw-semibold">Address</label>
                <textarea
                  className={`form-control shadow-sm ${validationErrors?.address ? "is-invalid" : ""}`}
                  rows="2"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
                {validationErrors?.address && (
                  <div className="invalid-feedback">
                    {validationErrors.address}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="col-12 text-end mt-3">
                <button
                  type="submit"
                  className="btn btn-primary px-4 shadow-sm"
                  disabled={actionLoading}
                >
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
