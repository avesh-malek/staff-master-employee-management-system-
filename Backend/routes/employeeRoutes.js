const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyEmployee,
  updateEmployee,
  deleteEmployee,
  updateMyProfilePicture,
  updateEmployeeProfilePictureById,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  createEmployeeValidation,
  updateEmployeeValidation,
  employeeIdParamValidation,
} = require("../middleware/validators/employeeValidator");
const { profileUpload } = require("../middleware/uploadMiddleware");

const employeeRoutes = express.Router();

employeeRoutes.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  createEmployeeValidation,
  handleValidationErrors,
  createEmployee
);

employeeRoutes.get("/", protect, authorizeRoles("admin", "hr"), getEmployees);
employeeRoutes.get("/me", protect, getMyEmployee);

employeeRoutes.get(
  "/:id",
  protect,
  employeeIdParamValidation,
  handleValidationErrors,
  getEmployeeById
);

employeeRoutes.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updateEmployeeValidation,
  handleValidationErrors,
  updateEmployee
);

employeeRoutes.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  employeeIdParamValidation,
  handleValidationErrors,
  deleteEmployee
);

employeeRoutes.patch(
  "/me/profile-picture",
  protect,
  profileUpload.single("profilePic"),
  updateMyProfilePicture
);

employeeRoutes.patch(
  "/:id/profile-picture",
  protect,
  authorizeRoles("admin", "hr"),
  employeeIdParamValidation,
  handleValidationErrors,
  profileUpload.single("profilePic"),
  updateEmployeeProfilePictureById
);

module.exports = employeeRoutes;
