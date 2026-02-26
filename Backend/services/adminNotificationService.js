const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");
const AppError = require("../utils/appError");

const toNotification = (item) => ({
  _id: item._id,
  type: item.type,
  title: item.title,
  message: item.message,
  link: item.link,
  entityId: item.entityId,
  isRead: item.isRead,
  createdAt: item.createdAt,
});

const createLeaveRequestNotifications = async ({ leaveId, employeeName }) => {
  const admins = await User.find({
    role: "admin",
    isActive: true,
    deletedAt: null,
  }).select("_id");

  if (!admins.length) return;

  const docs = admins.map((admin) => ({
    recipient: admin._id,
    type: "leave_request",
    title: "New leave request",
    message: `${employeeName} submitted a leave request`,
    link: "/admin/leaves",
    entityId: leaveId,
  }));

  await Notification.insertMany(docs);
};

const listMyAdminNotifications = async ({ requester }) => {
  const items = await Notification.find({ recipient: requester.id })
    .sort({ createdAt: -1 })
    .limit(100);

  return items.map(toNotification);
};

const getMyAdminUnreadCount = async ({ requester }) => {
  const unreadCount = await Notification.countDocuments({
    recipient: requester.id,
    isRead: false,
  });

  return { unreadCount };
};

const markMyAdminNotificationRead = async ({ requester, id }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid or missing input data", 400);
  }

  const item = await Notification.findOne({
    _id: id,
    recipient: requester.id,
  });

  if (!item) {
    throw new AppError("Notification not found", 404);
  }

  if (!item.isRead) {
    item.isRead = true;
    await item.save();
  }

  return toNotification(item);
};

module.exports = {
  createLeaveRequestNotifications,
  listMyAdminNotifications,
  getMyAdminUnreadCount,
  markMyAdminNotificationRead,
};
