const asyncHandler = require("../middleware/asyncHandler");
const adminNotificationService = require("../services/adminNotificationService");

const getAdminNotifications = asyncHandler(async (req, res) => {
  const items = await adminNotificationService.listMyAdminNotifications({
    requester: req.user,
  });

  return res.status(200).json(items);
});

const getAdminUnreadCount = asyncHandler(async (req, res) => {
  const data = await adminNotificationService.getMyAdminUnreadCount({
    requester: req.user,
  });

  return res.status(200).json(data);
});

const markAdminNotificationRead = asyncHandler(async (req, res) => {
  const item = await adminNotificationService.markMyAdminNotificationRead({
    requester: req.user,
    id: req.params.id,
  });

  return res.status(200).json(item);
});

module.exports = {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationRead,
};
