const { body, param, query } = require("express-validator");

const leaveTypes = ["casual", "sick", "paid", "unpaid"];
const leaveStatuses = ["pending", "approved", "rejected"];

const createLeaveValidation = [
  body("leaveType").isIn(leaveTypes),
  body("fromDate").isISO8601(),
  body("toDate").isISO8601(),
  body("reason").trim().notEmpty().isLength({ max: 500 }),
];

const leaveIdParamValidation = [param("id").isMongoId()];

const leaveListQueryValidation = [
  query("status").optional().isIn(leaveStatuses),
  query("month").optional().matches(/^\d{4}-\d{2}$/),
  query("page").optional().isInt({ min: 1 }),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 10 })
    .custom((value) => Number(value) === 10),
];

const updateLeaveStatusValidation = [
  param("id").isMongoId(),
  body("status").isIn(leaveStatuses),
];

module.exports = {
  createLeaveValidation,
  leaveIdParamValidation,
  leaveListQueryValidation,
  updateLeaveStatusValidation,
};
