const { body, param } = require("express-validator");

const leaveTypes = ["casual", "sick", "paid", "unpaid"];
const leaveStatuses = ["pending", "approved", "rejected"];

const createLeaveValidation = [
  body("leaveType").isIn(leaveTypes),
  body("fromDate").isISO8601(),
  body("toDate").isISO8601(),
  body("reason").trim().notEmpty().isLength({ max: 500 }),
];

const leaveIdParamValidation = [param("id").isMongoId()];

const updateLeaveStatusValidation = [
  param("id").isMongoId(),
  body("status").isIn(leaveStatuses),
];

module.exports = {
  createLeaveValidation,
  leaveIdParamValidation,
  updateLeaveStatusValidation,
};
