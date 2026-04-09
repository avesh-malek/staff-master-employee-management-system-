const { body, param, query } = require("express-validator");

const allowedStatuses = ["draft", "pending", "paid"];

const monthValidation = (field) =>
  body(field)
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12");

const yearValidation = (field) =>
  body(field)
    .optional({ checkFalsy: true })
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be valid");

const queryMonthValidation = (field) =>
  query(field)
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12");

const queryYearValidation = (field) =>
  query(field)
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be valid");

const payrollGenerateValidation = [
  body("period")
    .optional({ checkFalsy: true })
    .matches(/^\d{4}-\d{2}$/)
    .withMessage("Period must be in YYYY-MM format"),

  monthValidation("month"),
  yearValidation("year"),

  // ✅ IMPORTANT FIX (add this block)
  body("period").custom((value, { req }) => {
    const { month, year } = req.body;

    if (!value && (month == null || year == null)) {
      throw new Error("Provide either period OR month and year");
    }

    return true;
  }),
];

// ✅ LIST (ADMIN)
const payrollListValidation = [
  queryMonthValidation("month"),
  queryYearValidation("year"),
  query("status").optional().isIn(allowedStatuses),
  query("employeeId").optional().isMongoId(),

  query("search")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 100 }),

  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

// ✅ MY LIST
const payrollMyListValidation = [
  queryMonthValidation("month"),
  queryYearValidation("year"),
  query("status").optional().isIn(allowedStatuses),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

// ✅ PAY
const payrollPayValidation = [
  param("id").isMongoId().withMessage("Invalid payroll id"),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required"),

body("paymentDate")
  .notEmpty()
  .withMessage("Payment date is required")
   .bail() 
  .isISO8601()
  .withMessage("Invalid payment date"),

  body("transactionId")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }),
];

// ✅ ID
const payrollIdValidation = [
  param("id").isMongoId().withMessage("Invalid payroll id"),
];

// ✅ BULK DOWNLOAD
const payrollBulkValidation = [
  body("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),

  body("year")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be valid"),
  body("status").optional().isIn(allowedStatuses),
  body("employeeId").optional().isMongoId(),

  body("search")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 100 }),
];

module.exports = {
  payrollGenerateValidation,
  payrollListValidation,
  payrollMyListValidation,
  payrollPayValidation,
  payrollIdValidation,
  payrollBulkValidation,
};
