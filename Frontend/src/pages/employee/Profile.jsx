const Profile = () => {
  return (
    <div>
      <h3 className="mb-4 fw-bold">My Profile</h3>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">

              {/* Profile Header */}
              <div className="text-center mb-4">
                <img
                  src="/assets/default-user.png"
                  alt="Profile"
                  className="rounded-circle mb-2"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <h5 className="mb-0">Avesh Malek</h5>
                <small className="text-muted">Developer</small>

                {/* ONLY THIS ACTION */}
                <div className="mt-2">
                  <button className="btn btn-sm btn-outline-primary">
                    Change Profile Picture
                  </button>
                </div>
              </div>

              <hr />

              {/* Read-only Info */}
              <div className="row mb-3">
                <div className="col-sm-6">
                  <label className="text-muted">Employee ID</label>
                  <p className="fw-semibold">EMP001</p>
                </div>
                <div className="col-sm-6">
                  <label className="text-muted">Department</label>
                  <p className="fw-semibold">IT</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label className="text-muted">Email</label>
                  <p className="fw-semibold">avesh@gmail.com</p>
                </div>
                <div className="col-sm-6">
                  <label className="text-muted">Joining Date</label>
                  <p className="fw-semibold">12 Jan 2024</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label className="text-muted">Salary</label>
                  <p className="fw-semibold">₹50,000</p>
                </div>
                <div className="col-sm-6">
                  <label className="text-muted">Status</label>
                  <span className="badge bg-success">Active</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
