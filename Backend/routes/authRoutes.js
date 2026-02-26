const express = require("express");
const {
  login,
  getMe,
  forgotPassword,
  resetPassword,
  setPassword,
  bootstrapAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  bootstrapAdminValidation,
} = require("../middleware/validators/authValidator");
const { loginRateLimiter } = require("../middleware/rateLimitMiddleware");

const authRoutes = express.Router();

authRoutes.post("/login", loginRateLimiter, loginValidation, handleValidationErrors, login);
authRoutes.post(
  "/forgot-password",
  forgotPasswordValidation,
  handleValidationErrors,
  forgotPassword
);
authRoutes.post(
  "/reset-password/:token",
  resetPasswordValidation,
  handleValidationErrors,
  resetPassword
);
authRoutes.post(
  "/set-password/:token",
  resetPasswordValidation,
  handleValidationErrors,
  setPassword
);
authRoutes.post(
  "/bootstrap-admin",
  bootstrapAdminValidation,
  handleValidationErrors,
  bootstrapAdmin
);
authRoutes.get("/me", protect, getMe);

module.exports = authRoutes;
