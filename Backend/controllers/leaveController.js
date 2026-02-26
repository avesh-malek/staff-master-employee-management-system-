const asyncHandler = require("../middleware/asyncHandler");
const leaveService = require("../services/leaveService");

const createLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeave({
    payload: req.body,
    requester: req.user,
  });

  return res.status(201).json(leave);
});

const getLeaves = asyncHandler(async (req, res) => {
  const leaves = await leaveService.listLeaves({ requester: req.user });
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

module.exports = {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
};
