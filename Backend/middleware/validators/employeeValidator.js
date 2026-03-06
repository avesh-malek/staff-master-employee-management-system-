const { body, param } = require("express-validator");

const roles = ["admin", "hr", "employee"];
const employmentTypes = ["Full-time", "Intern", "Contract"];
const employmentStatuses = ["active", "inactive", "terminated", "on_leave"];

const createEmployeeValidation = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .matches(/^\d{10}$/)
    .withMessage("Phone must be exactly 10 digits"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  body("designation")
    .trim()
    .notEmpty()
    .withMessage("Designation is required"),

  body("employmentType")
    .notEmpty()
    .withMessage("Employment type is required")
    .bail()
    .isIn(employmentTypes)
    .withMessage("Invalid employment type"),

  body("salary")
  .notEmpty()
  .withMessage("Salary is required")
  .bail()
  .matches(/^[1-9]\d*$/)
  .withMessage("Salary must not contain leading zeros")
  .bail()
  .isFloat({ gt:0 })
  .withMessage("Salary must be greater than 0"),


  body("joiningDate")
    .notEmpty()
    .withMessage("Joining date is required")
    .bail()
    .isISO8601()
    .withMessage("Invalid joining date"),

  body("role")
    .optional()
    .isIn(roles)
    .withMessage("Invalid role"),

  body("employmentStatus")
    .optional()
    .isIn(employmentStatuses)
    .withMessage("Invalid employment status"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
];

const updateEmployeeValidation = [
  param("id").isMongoId().withMessage("Invalid employee ID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Phone must be exactly 10 digits"),

  body("department")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department cannot be empty"),

  body("designation")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Designation cannot be empty"),

  body("employmentType")
    .optional()
    .isIn(employmentTypes)
    .withMessage("Invalid employment type"),

  body("salary")
    .optional()
    .matches(/^[1-9]\d*$/)
    .withMessage("Salary must not contain leading zeros")
    .bail()
    .isFloat({ min: 5000, max: 500000 })
    .withMessage("Salary must be between 5,000 and 500,000"),

  body("joiningDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid joining date"),

  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address cannot be empty"),

  body("role")
    .optional()
    .isIn(roles)
    .withMessage("Invalid role"),

  body("employmentStatus")
    .optional()
    .isIn(employmentStatuses)
    .withMessage("Invalid employment status"),

  // Ensure at least one valid field is being updated
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

    if (!value || typeof value !== "object") {
      throw new Error("Invalid request body");
    }

    const hasValidField = Object.keys(value).some((key) =>
      allowed.includes(key)
    );

    if (!hasValidField) {
      throw new Error("No valid fields provided for update");
    }

    return true;
  }),
];

const employeeIdParamValidation = [param("id").isMongoId()];

module.exports = {
  createEmployeeValidation,
  updateEmployeeValidation,
  employeeIdParamValidation,
};
