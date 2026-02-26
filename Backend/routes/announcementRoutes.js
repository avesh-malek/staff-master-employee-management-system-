const express = require("express");
const {
  createAnnouncement,
  getAnnouncements,
  getUnreadCount,
  markAnnouncementRead,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");
const {
  createAnnouncementValidation,
  announcementIdParamValidation,
} = require("../middleware/validators/announcementValidator");

const announcementRoutes = express.Router();

announcementRoutes.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  createAnnouncementValidation,
  handleValidationErrors,
  createAnnouncement
);
announcementRoutes.get("/", protect, getAnnouncements);
announcementRoutes.get("/unread-count", protect, getUnreadCount);
announcementRoutes.patch(
  "/:id/read",
  protect,
  announcementIdParamValidation,
  handleValidationErrors,
  markAnnouncementRead
);
announcementRoutes.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  announcementIdParamValidation,
  handleValidationErrors,
  deleteAnnouncement
);

module.exports = announcementRoutes;
