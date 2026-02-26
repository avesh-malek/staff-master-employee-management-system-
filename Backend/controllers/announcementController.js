const asyncHandler = require("../middleware/asyncHandler");
const announcementService = require("../services/announcementService");

const createAnnouncement = asyncHandler(async (req, res) => {
  const item = await announcementService.createAnnouncement({
    payload: req.body,
    requester: req.user,
  });

  return res.status(201).json(item);
});

const getAnnouncements = asyncHandler(async (req, res) => {
  const items = await announcementService.listAnnouncements({ requester: req.user });
  return res.status(200).json(items);
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const data = await announcementService.getUnreadCount({ requester: req.user });
  return res.status(200).json(data);
});

const markAnnouncementRead = asyncHandler(async (req, res) => {
  const item = await announcementService.markAnnouncementRead({
    id: req.params.id,
    requester: req.user,
  });

  return res.status(200).json(item);
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  await announcementService.deleteAnnouncement({ id: req.params.id });
  return res.status(200).json({ message: "Announcement deleted successfully" });
});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getUnreadCount,
  markAnnouncementRead,
  deleteAnnouncement,
};
