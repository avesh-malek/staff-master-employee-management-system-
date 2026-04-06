const express = require("express");
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceByEmployee,
  getAttendanceAdmin,
  getAttendancePolicy,
  updateAttendancePolicy,
  getAttendanceDashboard,
} = require("../controllers/attendanceController");
const {
  exportMyAttendance,
  exportAdminAttendance,
} = require("../controllers/attendanceExportController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  attendanceEmployeeValidation,
  attendanceMonthValidation,
  attendanceAdminListValidation,
  attendanceExportMyValidation,
  attendanceExportAdminValidation,
  attendancePolicyValidation,
} = require("../middleware/validators/attendanceValidator");

const attendanceRoutes = express.Router();

attendanceRoutes.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceAdminListValidation,
  handleValidationErrors,
  getAttendanceAdmin
);

attendanceRoutes.get(
  "/export/me",
  protect,
  attendanceExportMyValidation,
  handleValidationErrors,
  exportMyAttendance
);

attendanceRoutes.get(
  "/export/admin",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceExportAdminValidation,
  handleValidationErrors,
  exportAdminAttendance
);

attendanceRoutes.get(
  "/dashboard",
  protect,
  authorizeRoles("admin", "hr"),
  getAttendanceDashboard
);

attendanceRoutes.get(
  "/policy",
  protect,
  authorizeRoles("admin", "hr","employee"),
  getAttendancePolicy
);

attendanceRoutes.patch(
  "/policy",
  protect,
  authorizeRoles("admin", "hr"),
  attendancePolicyValidation,
  handleValidationErrors,
  updateAttendancePolicy
);

attendanceRoutes.post("/check-in", protect, checkIn);
attendanceRoutes.post("/check-out", protect, checkOut);
attendanceRoutes.get(
  "/me",
  protect,
  attendanceMonthValidation,
  handleValidationErrors,
  getMyAttendance
);
attendanceRoutes.get(
  "/employee/:id",
  protect,
  authorizeRoles("admin", "hr"),
  attendanceEmployeeValidation,
  handleValidationErrors,
  getAttendanceByEmployee
);

module.exports = attendanceRoutes;
