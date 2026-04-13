const { body, param } = require("express-validator");

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required")
    .trim(),
];

const forgotPasswordValidation = [
  body("email").trim().isEmail().normalizeEmail(),
];

const resetPasswordValidation = [
  param("token").isString().trim().isLength({ min: 10 }),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character")
    .trim(),
];

const bootstrapAdminValidation = [
  body("name").isString().trim().notEmpty(),
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 8 }).trim(),
  body("setupKey").isString().trim().notEmpty(),
];

module.exports = {
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  bootstrapAdminValidation,
};
