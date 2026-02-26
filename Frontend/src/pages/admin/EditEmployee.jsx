import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeById, updateEmployee } from "../../features/employees/employeeSlice";

const EditEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { selected: employee, loading, actionLoading, error } = useSelector(
    (state) => state.employees
  );

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [dispatch, id]);

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
      joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : "",
      role: employee.role || "employee",
      isActive: employee.isActive,
      address: employee.address || "",
    };
  }, [employee, id]);

  const currentData = formData || serverData;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...(prev || serverData), [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...currentData,
      salary: Number(currentData.salary),
      isActive: currentData.isActive === "false" ? false : Boolean(currentData.isActive),
    };

    const result = await dispatch(updateEmployee({ id, payload }));
    if (!result.error) navigate("/admin/employees");
  };

  if (loading && !employee) return <p>Loading employee...</p>;
  if (!employee || employee._id !== id) return <p>Employee not found</p>;

  return (
    <div>
      <button className="btn btn-link mb-3" onClick={() => navigate("/admin/employees")}>
        Back to Employees
      </button>

      <h3 className="fw-bold mb-1">Edit Employee</h3>
      <p className="text-muted mb-4">Employee Code: {employee.employeeCode}</p>

      <div className="card shadow-sm">
        <div className="card-body">
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Employee Code</label>
                <input className="form-control" value={employee.employeeCode} disabled />
              </div>

              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input name="name" className="form-control" value={currentData.name} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input name="email" className="form-control" value={currentData.email} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" value={currentData.phone} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Department</label>
                <input name="department" className="form-control" value={currentData.department} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Designation</label>
                <input name="designation" className="form-control" value={currentData.designation} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Employment Type</label>
                <select name="employmentType" className="form-select" value={currentData.employmentType} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Intern">Intern</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Salary</label>
                <input name="salary" type="number" className="form-control" value={currentData.salary} onChange={handleChange} required />
              </div>

              <div className="col-md-4">
                <label className="form-label">Joining Date</label>
                <input name="joiningDate" type="date" className="form-control" value={currentData.joiningDate} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label">Role</label>
                <select name="role" className="form-select" value={currentData.role} onChange={handleChange}>
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select name="isActive" className="form-select" value={String(currentData.isActive)} onChange={handleChange}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="col-md-8">
                <label className="form-label">Address</label>
                <textarea name="address" className="form-control" rows="2" value={currentData.address} onChange={handleChange} />
              </div>

              <div className="col-12 text-end mt-3">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={() => navigate("/admin/employees")}>Cancel</button>
                <button className="btn btn-primary" disabled={actionLoading}>{actionLoading ? "Updating..." : "Update Employee"}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
