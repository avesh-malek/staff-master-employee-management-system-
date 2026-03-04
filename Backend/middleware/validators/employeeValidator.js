const { body, param } = require("express-validator");

const roles = ["admin", "hr", "employee"];
const employmentTypes = ["Full-time", "Intern", "Contract"];
const employmentStatuses = ["active", "inactive", "terminated", "on_leave"];

const createEmployeeValidation = [
  body("name").trim().notEmpty(),
  body("email").trim().isEmail().normalizeEmail(),
  body("phone").trim().matches(/^\d{10}$/),
  body("department").trim().notEmpty(),
  body("designation").trim().notEmpty(),
  body("employmentType").isIn(employmentTypes),
  body("salary").isNumeric(),
  body("joiningDate").isISO8601(),
  body("address").optional().trim(),
  body("role").optional().isIn(roles),
  body("employmentStatus").optional().isIn(employmentStatuses),
];

const updateEmployeeValidation = [
  param("id").isMongoId(),
  body("name").optional().trim().notEmpty(),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("phone").optional().trim().matches(/^\d{10}$/),
  body("department").optional().trim().notEmpty(),
  body("designation").optional().trim().notEmpty(),
  body("employmentType").optional().isIn(employmentTypes),
  body("salary").optional().isNumeric(),
  body("joiningDate").optional().isISO8601(),
  body("address").optional().trim(),
  body("role").optional().isIn(roles),
  body("employmentStatus").optional().isIn(employmentStatuses),
  body().custom((value) => {
    const allowed = [
      "name",
      "email",
      "phone",
      "department",
      "designation",
      "employmentType",
      "salary",
      "joiningDate",
      "address",
      "role",
      "employmentStatus",
    ];

    if (!value || typeof value !== "object") return false;
    return Object.keys(value).some((key) => allowed.includes(key));
  }),
];

const employeeIdParamValidation = [param("id").isMongoId()];

module.exports = {
  createEmployeeValidation,
  updateEmployeeValidation,
  employeeIdParamValidation,
};
