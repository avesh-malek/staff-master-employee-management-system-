const { body, param } = require("express-validator");

const loginValidation = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isString().notEmpty().trim(),
];

const forgotPasswordValidation = [
  body("email").trim().isEmail().normalizeEmail(),
];

const resetPasswordValidation = [
  param("token").isString().trim().isLength({ min: 10 }),
  body("password").isString().isLength({ min: 8 }).trim(),
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
