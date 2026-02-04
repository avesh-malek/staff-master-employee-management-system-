const AdminHR = () => {
  return (
    <div>
      <h3 className="mb-4 fw-bold">HR Management</h3>
     
      {/* HR List */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">HR List</h5>

          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>HR ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>HR001</td>
                <td>Rahul Sharma</td>
                <td>rahul@company.com</td>
                <td>Human Resources</td>
                <td>
                  <span className="badge bg-success">Active</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-1">
                    Disable
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                </td>
              </tr>

              <tr>
                <td>HR002</td>
                <td>Neha Verma</td>
                <td>neha@company.com</td>
                <td>HR</td>
                <td>
                  <span className="badge bg-danger">Disabled</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-success me-1">
                    Enable
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHR;
