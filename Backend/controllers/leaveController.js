const asyncHandler = require("../middleware/asyncHandler");
const leaveService = require("../services/leaveService");
const Leave = require("../models/Leave");
const createLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeave({
    payload: req.body,
    requester: req.user,
  });

  return res.status(201).json(leave);
});

const getLeaves = asyncHandler(async (req, res) => {
  const leaves = await leaveService.listLeaves({
    requester: req.user,
    filters: {
      status: req.query.status,
      month: req.query.month,
    },
  });
  return res.status(200).json(leaves);
});

const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await leaveService.getLeaveById({
    id: req.params.id,
    requester: req.user,
  });

  return res.status(200).json(leave);
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
  const leave = await leaveService.updateLeaveStatus({
    id: req.params.id,
    status: req.body.status,
    requester: req.user,
  });

  return res.status(200).json(leave);
});

const deleteLeave = asyncHandler(async (req, res) => {
  await leaveService.deleteLeave({
    id: req.params.id,
    requester: req.user,
  });

  return res.status(200).json({ message: "Leave request deleted successfully" });
});

// GET /api/leaves/admin/unread-count
const getAdminLeaveUnreadCount = asyncHandler(async (req, res) => {
  const count = await Leave.countDocuments({
    status: "pending",
  });

  res.status(200).json({ unreadCount: count });
});

module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
  getAdminLeaveUnreadCount,
};
