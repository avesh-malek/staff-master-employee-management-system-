import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeById,
  updateEmployee,
  clearEmployeeErrors,
} from "../../features/employees/employeeSlice";

const EditEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    selected: employee,
    loading,
    actionLoading,
    error,
    validationErrors,
  } = useSelector((state) => state.employees);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(clearEmployeeErrors());
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);
  // Original server data
  const serverData = useMemo(() => {
    if (!employee || employee._id !== id) return null;

    return {
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      employmentType: employee.employmentType || "Full-time",
      salary: employee.salary || "",
      joiningDate: employee.joiningDate
        ? employee.joiningDate.slice(0, 10)
        : "",
      role: employee.role || "employee",
      employmentStatus: employee.user?.employmentStatus || "active",
      address: employee.address || "",
    };
  }, [employee, id]);

  const currentData = formData || serverData;

  const isChanged = useMemo(() => {
    if (!serverData || !currentData) return false;

    return Object.keys(serverData).some(
      (key) => String(serverData[key]) !== String(currentData[key]),
    );
  }, [serverData, currentData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...(prev || serverData),
      [name]: value,
    }));

    dispatch(clearFieldError(name));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isChanged) return;

    const payload = {
      ...currentData,
      salary: Number(currentData.salary),
    };

    const result = await dispatch(updateEmployee({ id, payload }));
    if (!result.error) navigate("/admin/employees");
  };

  if (loading && !employee)
    return <div className="p-4">Loading employee...</div>;

  if (!employee || employee._id !== id)
    return <div className="p-4">Employee not found</div>;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <h5 className="fw-bold mb-1">Edit Employee</h5>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
          Employee Code: {employee.employeeCode}
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Employee Code */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Employee Code</label>
                <input
                  className="form-control shadow-sm"
                  value={employee.employeeCode}
                  disabled
                />
              </div>

              {/* Name */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Name</label>
                <input
                  name="name"
                  className={`form-control shadow-sm ${
                    validationErrors?.name ? "is-invalid" : ""
                  }`}
                  value={currentData?.name || ""}
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
                  name="email"
                  className={`form-control shadow-sm ${
                    validationErrors?.email ? "is-invalid" : ""
                  }`}
                  value={currentData?.email || ""}
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
                  name="phone"
                  className={`form-control shadow-sm ${
                    validationErrors?.phone ? "is-invalid" : ""
                  }`}
                  value={currentData?.phone || ""}
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
                  name="department"
                  className={`form-control shadow-sm ${
                    validationErrors?.department ? "is-invalid" : ""
                  }`}
                  value={currentData?.department || ""}
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
                  name="designation"
                  className={`form-control shadow-sm ${
                    validationErrors?.designation ? "is-invalid" : ""
                  }`}
                  value={currentData?.designation || ""}
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
                  name="employmentType"
                  className="form-select shadow-sm"
                  value={currentData?.employmentType || ""}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Intern">Intern</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/* Salary */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Salary</label>
                <input
                  type="number"
                  name="salary"
                  className={`form-control shadow-sm ${
                    validationErrors?.salary ? "is-invalid" : ""
                  }`}
                  value={currentData?.salary || ""}
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
                  name="joiningDate"
                  className="form-control shadow-sm"
                  value={currentData?.joiningDate || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Role */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Role</label>
                <select
                  name="role"
                  className="form-select shadow-sm"
                  value={currentData?.role || ""}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Employment Status
                </label>
                <select
                  name="employmentStatus"
                  className="form-select shadow-sm"
                  value={currentData?.employmentStatus || ""}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>

              {/* Address */}
              <div className="col-md-8">
                <label className="form-label fw-semibold">Address</label>
                <textarea
                  name="address"
                  rows="2"
                  className="form-control shadow-sm"
                  value={currentData?.address || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="col-12 text-end mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 me-2"
                  onClick={() => navigate("/admin/employees")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary px-4 shadow-sm"
                  disabled={actionLoading || !isChanged}
                >
                  {actionLoading
                    ? "Updating..."
                    : !isChanged
                      ? "No Changes"
                      : "Update Employee"}
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
