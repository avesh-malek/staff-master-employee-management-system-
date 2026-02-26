const express = require("express");
const {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  createLeaveValidation,
  updateLeaveStatusValidation,
  leaveIdParamValidation,
} = require("../middleware/validators/leaveValidator");

const leaveRoutes = express.Router();

leaveRoutes.post("/", protect, createLeaveValidation, handleValidationErrors, createLeave);
leaveRoutes.get("/", protect, getLeaves);

leaveRoutes.get(
  "/:id",
  protect,
  leaveIdParamValidation,
  handleValidationErrors,
  getLeaveById
);

leaveRoutes.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "hr"),
  updateLeaveStatusValidation,
  handleValidationErrors,
  updateLeaveStatus
);

leaveRoutes.delete(
  "/:id",
  protect,
  leaveIdParamValidation,
  handleValidationErrors,
  deleteLeave
);

module.exports = leaveRoutes;
