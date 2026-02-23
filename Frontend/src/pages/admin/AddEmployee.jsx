const AddEmployee = () => {
  return (
    <div>
      <h3 className="mb-4 fw-bold">Add Employee</h3>

      <div className="card shadow-sm">
        <div className="card-body">
          <form>
            <div className="row g-3">
              {/* Employee ID (auto) */}
              <div className="col-md-4">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  className="form-control"
                  value="Auto-generated" // will fetch from backend later
                  disabled
                />
              </div>

              {/* Name */}
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" placeholder="Full Name" />
              </div>

              {/* Email */}
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Email" />
              </div>

              {/* Phone */}
              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" placeholder="Phone Number" />
              </div>

              {/* Address */}
              <div className="col-md-8">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows="2" placeholder="Address"></textarea>
              </div>

              {/* Department */}
              <div className="col-md-4">
                <label className="form-label">Department</label>
                <input type="text" className="form-control" placeholder="IT, HR..." />
              </div>

              {/* Designation */}
              <div className="col-md-4">
                <label className="form-label">Designation</label>
                <input type="text" className="form-control" placeholder="Developer, Manager..." />
              </div>

              {/* Salary */}
              <div className="col-md-4">
                <label className="form-label">Salary</label>
                <input type="number" className="form-control" placeholder="Salary" />
              </div>

              {/* Joining Date */}
              <div className="col-md-4">
                <label className="form-label">Joining Date</label>
                <input type="date" className="form-control" />
              </div>

              {/* Role */}
              <div className="col-md-4">
                <label className="form-label">Role</label>
                <select className="form-select">
                  <option value="employee">Employee</option>
                  <option value="hr">HR Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Profile Picture */}
              <div className="col-md-4">
                <label className="form-label">Profile Picture</label>
                <input type="file" className="form-control" />
              </div>

              {/* Submit */}
              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary">
                  Add Employee
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
