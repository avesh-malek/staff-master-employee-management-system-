const Attendance = () => {
  return (
    <div>
      <h3 className="mb-4 fw-bold">My Attendance</h3>

      {/* Today Attendance */}
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h5 className="fw-bold mb-3">Today's Attendance</h5>

          <div className="row mb-3">
            <div className="col-md-3">
              <p className="text-muted mb-1">Date</p>
              <h6>04 Feb 2024</h6>
            </div>

            <div className="col-md-3">
              <p className="text-muted mb-1">Check In</p>
              <h6 className="text-success">09:12 AM</h6>
            </div>

            <div className="col-md-3">
              <p className="text-muted mb-1">Check Out</p>
              <h6 className="text-warning">Auto (06:00 PM)</h6>
            </div>

            <div className="col-md-3">
              <p className="text-muted mb-1">Status</p>
              <span className="badge bg-success">Present</span>
            </div>
          </div>

          <button className="btn btn-primary">Check In</button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">
            <div className="col-md-4">
              <label className="form-label">Select Month</label>
              <input type="month" className="form-control" />
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select className="form-select">
                <option>All</option>
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>

            <div className="col-md-4">
              <button className="btn btn-primary w-100">Filter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>01 Feb 2024</td>
                <td>09:05 AM</td>
                <td>06:00 PM</td>
                <td>
                  <span className="badge bg-success">Present</span>
                </td>
              </tr>

              <tr>
                <td>02 Feb 2024</td>
                <td>—</td>
                <td>—</td>
                <td>
                  <span className="badge bg-danger">Absent</span>
                </td>
              </tr>

              <tr>
                <td>03 Feb 2024</td>
                <td>09:10 AM</td>
                <td>05:55 PM</td>
                <td>
                  <span className="badge bg-success">Present</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
