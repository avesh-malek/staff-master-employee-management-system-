const EmployeeAnnouncements = () => {
  return (
    <div>
      <h3 className="mb-4 fw-bold">Company Announcements</h3>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="fw-bold">Office Holiday</h5>
          <p>
            Office will remain closed on Friday due to maintenance.
          </p>
          <small className="text-muted">Posted on 05 Feb 2026</small>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="fw-bold">New HR Policy</h5>
          <p>
            New leave policy will be effective from next month.
          </p>
          <small className="text-muted">Posted on 02 Feb 2026</small>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnnouncements;
