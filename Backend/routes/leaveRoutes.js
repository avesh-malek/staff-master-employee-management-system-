const express = require("express");
const {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
  getAdminLeaveUnreadCount
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  createLeaveValidation,
  updateLeaveStatusValidation,
  leaveIdParamValidation,
  leaveListQueryValidation,
} = require("../middleware/validators/leaveValidator");

const leaveRoutes = express.Router();

leaveRoutes.post("/", protect, createLeaveValidation, handleValidationErrors, createLeave);
leaveRoutes.get(
  "/",
  protect,
  leaveListQueryValidation,
  handleValidationErrors,
  getLeaves
);

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

leaveRoutes.get(
  "/admin/unread-count",
  protect,
  authorizeRoles("admin"),
  getAdminLeaveUnreadCount
);

module.exports = leaveRoutes;
