const express = require("express");
const {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  notificationIdParamValidation,
} = require("../middleware/validators/notificationValidator");

const notificationRoutes = express.Router();

notificationRoutes.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getAdminNotifications
);

notificationRoutes.get(
  "/unread-count",
  protect,
  authorizeRoles("admin", "hr"),
  getAdminUnreadCount
);

notificationRoutes.patch(
  "/:id/read",
  protect,
  authorizeRoles("admin", "hr"),
  notificationIdParamValidation,
  handleValidationErrors,
  markAdminNotificationRead
);

module.exports = notificationRoutes;
