import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendancePolicy } from "../features/attendance/attendanceSlice";

const AttendancePolicyModal = ({ onClose }) => {
  const dispatch = useDispatch();

  const { policy, policyLoading } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    dispatch(fetchAttendancePolicy());
  }, [dispatch]);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
    >
      <div className="card border-0 shadow-sm" style={{ width: "360px" }}>
        <div className="card-body py-3 px-3">

          <div className="d-flex justify-content-between mb-2">
            <h6 className="fw-semibold mb-0">Attendance Policy</h6>
            <button className="btn btn-sm btn-light" onClick={onClose}>
              ✕
            </button>
          </div>

          {policyLoading ? (
            <div className="small text-muted">Loading...</div>
          ) : (
            <div className="small text-muted">

              <div className="d-flex justify-content-between">
                <span>Start</span>
                <span>{policy?.officeStartTime || "-"}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>On-Time</span>
                <span>{policy?.onTimeLimit || "-"}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Grace</span>
                <span>{policy?.graceLateLimit || "-"}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>End</span>
                <span>{policy?.officeEndTime || "-"}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Half Day</span>
                <span>{policy?.halfDayHours ?? "-"} hrs</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Auto Checkout</span>
                <span>
                  {policy
                    ? policy.autoCheckoutEnabled
                      ? "Enabled"
                      : "Disabled"
                    : "-"}
                </span>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePolicyModal;