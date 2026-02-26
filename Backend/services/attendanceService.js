const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const AppError = require("../utils/appError");

const getDayStart = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDayEnd = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const formatAttendance = (record) => ({
  _id: record._id,
  employee: record.employee,
  date: record.date,
  checkIn: record.checkIn,
  checkOut: record.checkOut,
  workingHours: record.workingHours,
  createdAt: record.createdAt,
});

const checkIn = async ({ requester }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const dayStart = getDayStart();
  const dayEnd = getDayEnd();

  let record = await Attendance.findOne({
    employee: requester.employeeId,
    date: { $gte: dayStart, $lte: dayEnd },
  });

  if (record && record.checkIn) {
    throw new AppError("Already checked in for today", 400);
  }

  if (!record) {
    record = await Attendance.create({
      employee: requester.employeeId,
      date: dayStart,
      checkIn: new Date(),
    });
  } else {
    record.checkIn = new Date();
    await record.save();
  }

  return formatAttendance(record);
};

const checkOut = async ({ requester }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const dayStart = getDayStart();
  const dayEnd = getDayEnd();

  const record = await Attendance.findOne({
    employee: requester.employeeId,
    date: { $gte: dayStart, $lte: dayEnd },
  });

  if (!record || !record.checkIn) {
    throw new AppError("Check-in required before check-out", 400);
  }

  if (record.checkOut) {
    throw new AppError("Already checked out for today", 400);
  }

  record.checkOut = new Date();
  const diffMs = record.checkOut.getTime() - record.checkIn.getTime();
  record.workingHours = Math.max(0, Number((diffMs / (1000 * 60 * 60)).toFixed(2)));

  await record.save();

  return formatAttendance(record);
};

const listMyAttendance = async ({ requester, month }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const query = { employee: requester.employeeId };

  if (month) {
    const [year, monthIndex] = month.split("-").map(Number);
    const start = new Date(year, monthIndex - 1, 1);
    const end = new Date(year, monthIndex, 0, 23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const records = await Attendance.find(query).sort({ date: -1 });

  return records.map(formatAttendance);
};

const listAttendanceForEmployee = async ({ employeeId, month }) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new AppError("Invalid employee id", 400);
  }

  const query = { employee: employeeId };

  if (month) {
    const [year, monthIndex] = month.split("-").map(Number);
    const start = new Date(year, monthIndex - 1, 1);
    const end = new Date(year, monthIndex, 0, 23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const records = await Attendance.find(query).sort({ date: -1 });
  return records.map(formatAttendance);
};

const listAttendanceForAdmin = async ({ filters }) => {
  const query = {};

  if (filters.employeeId) {
    if (!mongoose.Types.ObjectId.isValid(filters.employeeId)) {
      throw new AppError("Invalid employee id", 400);
    }
    query.employee = filters.employeeId;
  }

  if (filters.date) {
    const selectedDate = new Date(filters.date);
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const employeeMatch = {};
  if (filters.department) {
    employeeMatch.department = filters.department.trim();
  }

  const records = await Attendance.find(query)
    .populate({
      path: "employee",
      select: "name employeeCode department",
      match: Object.keys(employeeMatch).length ? employeeMatch : undefined,
    })
    .sort({ date: -1, createdAt: -1 });

  return records
    .filter((item) => item.employee)
    .map((item) => ({
      _id: item._id,
      employee: {
        _id: item.employee._id,
        name: item.employee.name,
        employeeCode: item.employee.employeeCode,
        department: item.employee.department,
      },
      date: item.date,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      workingHours: item.workingHours,
      createdAt: item.createdAt,
    }));
};

module.exports = {
  checkIn,
  checkOut,
  listMyAttendance,
  listAttendanceForEmployee,
  listAttendanceForAdmin,
};
