const Leave = () => {
  return (
    <div>
      <h3 className="mb-4 fw-bold">My Leave</h3>

      {/* Apply Leave */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Apply for Leave</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">To Date</label>
              <input type="date" className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Leave Type</label>
              <select className="form-select">
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Paid Leave</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Reason for leave"
              ></textarea>
            </div>

            <div className="col-12 text-end">
              <button className="btn btn-primary">
                Apply Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave History */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Leave History</h5>

          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>10 Feb 2024</td>
                <td>12 Feb 2024</td>
                <td>Sick Leave</td>
                <td>Fever</td>
                <td>
                  <span className="badge bg-warning">Pending</span>
                </td>
              </tr>

              <tr>
                <td>01 Jan 2024</td>
                <td>01 Jan 2024</td>
                <td>Casual Leave</td>
                <td>Personal</td>
                <td>
                  <span className="badge bg-success">Approved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leave;
