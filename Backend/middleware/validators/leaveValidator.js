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
