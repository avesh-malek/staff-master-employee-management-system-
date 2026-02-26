const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { sendLeaveStatusEmail } = require("./notificationService");
const {
  createLeaveRequestNotifications,
} = require("./adminNotificationService");

const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid leave id", 400);
  }
};

const normalizeLeave = (leave) => ({
  _id: leave._id,
  employee: {
    _id: leave.employee._id,
    employeeCode: leave.employee.employeeCode,
    name: leave.employee.name,
  },
  leaveType: leave.leaveType,
  fromDate: leave.fromDate,
  toDate: leave.toDate,
  reason: leave.reason,
  status: leave.status,
  reviewedBy: leave.reviewedBy,
  reviewedAt: leave.reviewedAt,
  createdAt: leave.createdAt,
});

const createLeave = async ({ payload, requester }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const fromDate = new Date(payload.fromDate);
  const toDate = new Date(payload.toDate);
  if (fromDate > toDate) {
    throw new AppError("Invalid leave dates", 400);
  }

  const leave = await Leave.create({
    employee: requester.employeeId,
    leaveType: payload.leaveType,
    fromDate,
    toDate,
    reason: payload.reason.trim(),
  });

  const populated = await leave.populate("employee", "employeeCode name");
  await createLeaveRequestNotifications({
    leaveId: leave._id,
    employeeName: populated.employee.name,
  });
  return normalizeLeave(populated);
};

const listLeaves = async ({ requester }) => {
  const query = ["admin", "hr"].includes(requester.role)
    ? {}
    : { employee: requester.employeeId };

  const leaves = await Leave.find(query)
    .populate("employee", "employeeCode name")
    .sort({ createdAt: -1 });

  return leaves.map(normalizeLeave);
};

const getLeaveById = async ({ id, requester }) => {
  assertObjectId(id);

  const leave = await Leave.findById(id).populate("employee", "employeeCode name user");

  if (!leave) {
    throw new AppError("Leave request not found", 404);
  }

  const isAdminOrHr = ["admin", "hr"].includes(requester.role);
  const isOwner = requester.employeeId && leave.employee._id.toString() === requester.employeeId.toString();

  if (!isAdminOrHr && !isOwner) {
    throw new AppError("Forbidden", 403);
  }

  return normalizeLeave(leave);
};

const updateLeaveStatus = async ({ id, status, requester }) => {
  assertObjectId(id);

  const leave = await Leave.findById(id).populate("employee", "employeeCode name user");

  if (!leave) {
    throw new AppError("Leave request not found", 404);
  }

  leave.status = status;
  leave.reviewedBy = requester.id;
  leave.reviewedAt = new Date();
  await leave.save();

  if (leave.employee?.user) {
    const user = await User.findById(leave.employee.user);
    if (user?.email) {
      await sendLeaveStatusEmail({
        email: user.email,
        status,
        fromDate: leave.fromDate.toISOString().slice(0, 10),
        toDate: leave.toDate.toISOString().slice(0, 10),
      });
    }
  }

  return normalizeLeave(leave);
};

const deleteLeave = async ({ id, requester }) => {
  assertObjectId(id);

  const leave = await Leave.findById(id);

  if (!leave) {
    throw new AppError("Leave request not found", 404);
  }

  const isAdminOrHr = ["admin", "hr"].includes(requester.role);
  const isOwner = requester.employeeId && leave.employee.toString() === requester.employeeId.toString();

  if (!isAdminOrHr && !isOwner) {
    throw new AppError("Forbidden", 403);
  }

  if (!isAdminOrHr && leave.status !== "pending") {
    throw new AppError("Forbidden", 403);
  }

  await leave.deleteOne();
};

module.exports = {
  createLeave,
  listLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave,
};
