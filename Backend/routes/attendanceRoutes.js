const express = require("express");
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceByEmployee,
  getAttendanceAdmin,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  attendanceEmployeeValidation,
  attendanceMonthValidation,
  attendanceAdminListValidation,
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
