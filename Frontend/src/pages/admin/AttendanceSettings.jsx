import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendancePolicy,
  updateAttendancePolicy,
} from "../../features/attendance/attendanceSlice";
import { useNavigate } from "react-router-dom";
const AttendanceSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { policy, policyLoading, error, validationErrors } = useSelector(
    (state) => state.attendance,
  );

  const isInitialLoading = policyLoading && !policy;
  const isSaving = policyLoading && Boolean(policy);

  const [form, setForm] = useState({
    officeStartTime: "09:00",
    onTimeLimit: "09:20",
    graceLateLimit: "09:40",
    officeEndTime: "18:00",
    halfDayHours: 4,
    autoCheckoutEnabled: true,
  });

  useEffect(() => {
    dispatch(fetchAttendancePolicy());
  }, [dispatch]);

  useEffect(() => {
    if (policy) {
      setForm({
        officeStartTime: policy.officeStartTime || "09:00",
        onTimeLimit: policy.onTimeLimit || "09:20",
        graceLateLimit: policy.graceLateLimit || "09:40",
        officeEndTime: policy.officeEndTime || "18:00",
        halfDayHours: policy.halfDayHours ?? 4,
        autoCheckoutEnabled: Boolean(policy.autoCheckoutEnabled),
      });
    }
  }, [policy]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      updateAttendancePolicy({
        ...form,
        halfDayHours: Number(form.halfDayHours),
      }),
    );
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h6 className="fw-semibold mb-1">Attendance Settings</h6>
          <p className="text-muted mb-0 small">
            Configure office timings and rules
          </p>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/admin/attendance")}
        >
          ← Back
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          {/* 🔴 Top Error (general validation / server error) */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2">
              <span>{error}</span>
            </div>
          )}

          {isInitialLoading && <p className="text-muted">Loading policy...</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-4">
              {/* Office Start */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Office Start Time
                </label>
                <input
                  type="time"
                  name="officeStartTime"
                  value={form.officeStartTime}
                  onChange={handleChange}
                  className={`form-control ${
                    validationErrors?.officeStartTime ? "is-invalid" : ""
                  }`}
                  required
                />
                <div className="invalid-feedback">
                  {validationErrors?.officeStartTime}
                </div>
              </div>

              {/* On Time */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">On-Time Limit</label>
                <input
                  type="time"
                  name="onTimeLimit"
                  value={form.onTimeLimit}
                  onChange={handleChange}
                  className={`form-control ${
                    validationErrors?.onTimeLimit ? "is-invalid" : ""
                  }`}
                  required
                />
                <div className="invalid-feedback">
                  {validationErrors?.onTimeLimit}
                </div>
              </div>

              {/* Grace Late */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Grace Late Limit
                </label>
                <input
                  type="time"
                  name="graceLateLimit"
                  value={form.graceLateLimit}
                  onChange={handleChange}
                  className={`form-control ${
                    validationErrors?.graceLateLimit ? "is-invalid" : ""
                  }`}
                  required
                />
                <div className="invalid-feedback">
                  {validationErrors?.graceLateLimit}
                </div>
              </div>

              {/* Office End */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Office End Time
                </label>
                <input
                  type="time"
                  name="officeEndTime"
                  value={form.officeEndTime}
                  onChange={handleChange}
                  className={`form-control ${
                    validationErrors?.officeEndTime ? "is-invalid" : ""
                  }`}
                  required
                />
                <div className="invalid-feedback">
                  {validationErrors?.officeEndTime}
                </div>
              </div>

              {/* Half Day */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Half Day Hours</label>
                <input
                  type="number"
                  name="halfDayHours"
                  value={form.halfDayHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className={`form-control ${
                    validationErrors?.halfDayHours ? "is-invalid" : ""
                  }`}
                  required
                />
                <div className="invalid-feedback">
                  {validationErrors?.halfDayHours}
                </div>
              </div>

              {/* Checkbox */}
              <div className="col-md-4 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoCheckoutEnabled"
                    name="autoCheckoutEnabled"
                    checked={form.autoCheckoutEnabled}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="autoCheckoutEnabled"
                  >
                    Auto Checkout
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="col-12 d-flex justify-content-between align-items-center mt-3">
                <div className="small text-muted">
                  Last Updated:{" "}
                  {policy?.updatedAt
                    ? new Date(policy.updatedAt).toLocaleString()
                    : "-"}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={policyLoading}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSettings;
