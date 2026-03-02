const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { sendAnnouncementEmail } = require("./notificationService");

const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid announcement id", 400);
  }
};

const normalizeAnnouncement = (item, requesterId) => ({
  _id: item._id,
  title: item.title,
  message: item.message,
  createdBy: item.createdBy,
  createdAt: item.createdAt,
  unread: requesterId
    ? !item.readBy.some((userId) => userId.toString() === requesterId.toString())
    : false,
});

const createAnnouncement = async ({ payload, requester }) => {
  const announcement = await Announcement.create({
    title: payload.title.trim(),
    message: payload.message.trim(),
    createdBy: requester.id,
  });

  const users = await User.find({
    role: "employee",
    employmentStatus: { $ne: false },
    deletedAt: null,
  }).select("email");

  const recipients = users.map((user) => user.email).filter(Boolean);
  await sendAnnouncementEmail({
    recipients,
    title: announcement.title,
    message: announcement.message,
  });

  return normalizeAnnouncement(announcement, requester.id);
};

const listAnnouncements = async ({ requester }) => {
  const items = await Announcement.find().sort({ createdAt: -1 });
  return items.map((item) => normalizeAnnouncement(item, requester.id));
};

const markAnnouncementRead = async ({ id, requester }) => {
  assertObjectId(id);

  const item = await Announcement.findById(id);
  if (!item) {
    throw new AppError("Announcement not found", 404);
  }

  const alreadyRead = item.readBy.some(
    (userId) => userId.toString() === requester.id.toString()
  );

  if (!alreadyRead) {
    item.readBy.push(requester.id);
    await item.save();
  }

  return normalizeAnnouncement(item, requester.id);
};

const getUnreadCount = async ({ requester }) => {
  const count = await Announcement.countDocuments({
    readBy: { $ne: requester.id },
  });

  return { unreadCount: count };
};

const deleteAnnouncement = async ({ id }) => {
  assertObjectId(id);

  const deleted = await Announcement.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError("Announcement not found", 404);
  }
};

module.exports = {
  createAnnouncement,
  listAnnouncements,
  markAnnouncementRead,
  getUnreadCount,
  deleteAnnouncement,
};
