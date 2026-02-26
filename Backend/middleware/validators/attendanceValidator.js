const { param, query } = require("express-validator");

const attendanceEmployeeValidation = [
  param("id").isMongoId(),
  query("month").optional().matches(/^\d{4}-\d{2}$/),
];

const attendanceMonthValidation = [
  query("month").optional().matches(/^\d{4}-\d{2}$/),
];

const attendanceAdminListValidation = [
  query("employeeId").optional().isMongoId(),
  query("date").optional().isISO8601(),
  query("department").optional().trim().notEmpty(),
];

module.exports = {
  attendanceEmployeeValidation,
  attendanceMonthValidation,
  attendanceAdminListValidation,
};
