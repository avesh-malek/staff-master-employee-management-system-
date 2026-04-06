const { param, query, body } = require("express-validator");

const attendanceEmployeeValidation = [
  param("id").isMongoId(),
  query("month")
    .optional()
    .matches(/^\d{4}-\d{2}$/),
];

const attendanceMonthValidation = [
  query("month")
    .optional()
    .matches(/^\d{4}-\d{2}$/),
  query("status").optional().isIn([
    "present",
    "present_late",
    "present_grace",
    "half_day",
    "early_leave",
    "absent",
    "not_checked_in",
    "all_present",
  ]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),
];

const attendanceAdminListValidation = [
  query("employeeId").optional().isMongoId(),
  query("date").optional().isISO8601(),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  query("department").optional().trim().notEmpty(),
  query("status").optional().isIn([
    "present",
    "present_late",
    "present_grace",
    "half_day",
    "early_leave",
    "absent",
    "not_checked_in",
    "all_present", 
  ]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),
  query("to").custom((value, { req }) => {
    if (!value || !req.query.from) return true;
    return new Date(req.query.from) <= new Date(value);
  }),
];

const attendanceExportMyValidation = [
  query("month").optional().matches(/^\d{4}-\d{2}$/),
  query("status").optional().isIn([
    "present",
    "present_late",
    "present_grace",
    "half_day",
    "early_leave",
    "absent",
    "not_checked_in",
    "all_present",
  ]),
];

const attendanceExportAdminValidation = [
  query("employeeId").optional().isMongoId(),
  query("date").optional().isISO8601(),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  query("department").optional().trim().notEmpty(),
  query("status").optional().isIn([
    "present",
    "present_late",
    "present_grace",
    "half_day",
    "early_leave",
    "absent",
    "not_checked_in",
    "all_present",
  ]),
  query("to").custom((value, { req }) => {
    if (!value || !req.query.from) return true;
    return new Date(req.query.from) <= new Date(value);
  }),
];

const attendancePolicyValidation = [
  body("officeStartTime")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Office start must be in HH:MM format"),

  body("onTimeLimit")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("On-time limit must be in HH:MM format"),

  body("graceLateLimit")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Grace late must be in HH:MM format"),

  body("officeEndTime")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Office end must be in HH:MM format"),

  body("halfDayHours")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Half day hours must be greater than 0"),

  body("autoCheckoutEnabled")
    .optional()
    .isBoolean()
    .withMessage("Auto checkout must be true or false"),

  // ✅ LOGIC VALIDATIONS (ADD HERE)

  body("onTimeLimit").custom((value, { req }) => {
    if (!value || !req.body.officeStartTime) return true;

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    if (toMinutes(value) < toMinutes(req.body.officeStartTime)) {
      throw new Error("On-time must be greater than office start");
    }

    return true;
  }),

  body("graceLateLimit").custom((value, { req }) => {
    if (!value || !req.body.onTimeLimit) return true;

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    if (toMinutes(value) < toMinutes(req.body.onTimeLimit)) {
      throw new Error("Grace late must be greater than on-time");
    }

    return true;
  }),

  body("officeEndTime").custom((value, { req }) => {
    if (!value || !req.body.graceLateLimit) return true;

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    if (toMinutes(value) < toMinutes(req.body.graceLateLimit)) {
      throw new Error("Office end must be greater than grace late");
    }

    return true;
  }),
];

module.exports = {
  attendanceEmployeeValidation,
  attendanceMonthValidation,
  attendanceAdminListValidation,
  attendanceExportMyValidation,
  attendanceExportAdminValidation,
  attendancePolicyValidation,
};
