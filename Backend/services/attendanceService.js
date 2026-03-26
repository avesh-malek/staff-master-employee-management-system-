const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const AttendancePolicy = require("../models/AttendancePolicy");
const Employee = require("../models/Employee");
const AppError = require("../utils/appError");
const { getPagination, buildPaginationResult } = require("../utils/pagination");
const { scheduleAutoCheckout } = require("./cronJobs");
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

const buildTimeForDate = (date, timeValue) => {
  const [hours, minutes] = String(timeValue || "00:00")
    .split(":")
    .map(Number);
  const d = new Date(date);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  return d;
};

const getAttendancePolicy = async () => {
  let policy = await AttendancePolicy.findOne();
  if (!policy) {
    policy = await AttendancePolicy.create({});
  }
  return policy;
};

const formatAttendance = (record, policy) => {
  const now = new Date();
  const officeEnd = buildTimeForDate(record.date, policy.officeEndTime);

  const isAfterOfficeEnd =
    getDayStart(record.date) < getDayStart(now) || now > officeEnd;

  return {
    _id: record._id,
    employee: record.employee,
    date: record.date,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    checkInStatus: record.checkInStatus,
    workingHours: record.workingHours,
    createdAt: record.createdAt,
    status: getStatus(record, isAfterOfficeEnd, policy), // ✅ ADD THIS
  };
};

const checkIn = async ({ requester }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const dayStart = getDayStart();
  const dayEnd = getDayEnd();
  const policy = await getAttendancePolicy();

  const now = new Date();

  // 🔥 VALIDATION: prevent early check-in
  const officeStart = buildTimeForDate(now, policy.officeStartTime);
  const officeEnd = buildTimeForDate(now, policy.officeEndTime);

  if (now < officeStart) {
    throw new AppError("Cannot check in before office start", 400);
  }

  if (now > officeEnd) {
    throw new AppError("Cannot check in after office hours", 400);
  }

  // 👇 existing logic
  const onTimeLimit = buildTimeForDate(now, policy.onTimeLimit);
  const graceLateLimit = buildTimeForDate(now, policy.graceLateLimit);

  let checkInStatus = "late";

  if (now <= onTimeLimit) {
    checkInStatus = "on_time";
  } else if (now <= graceLateLimit) {
    checkInStatus = "grace_late";
  }

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
      checkIn: now,
      checkInStatus,
    });
  } else {
    record.checkIn = now;
    record.checkInStatus = checkInStatus;
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
  record.workingHours = Math.max(
    0,
    Number((diffMs / (1000 * 60 * 60)).toFixed(2)),
  );

  await record.save();

  return formatAttendance(record);
};

const listMyAttendance = async ({ requester, month, page, limit }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const { page: p, limit: l, skip } = getPagination({ page, limit });

  const query = { employee: requester.employeeId };

  let start, end;

  if (month) {
    const [year, monthIndex] = month.split("-").map(Number);
    start = new Date(year, monthIndex - 1, 1);
    end = new Date(year, monthIndex, 0, 23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  // ✅ fetch existing records
  const dbRecords = await Attendance.find(query).sort({ date: -1 });
  const policy = await getAttendancePolicy();

  // ✅ convert to map for fast lookup
  const recordMap = new Map();
  dbRecords.forEach((rec) => {
    recordMap.set(new Date(rec.date).toDateString(), rec);
  });

  // ✅ generate full month dates
  const allDays = [];
  if (start && end) {
    let current = new Date(start);

    const today = new Date();

    while (current <= end && current <= today) {
      const key = current.toDateString();

      if (recordMap.has(key)) {
        allDays.push(formatAttendance(recordMap.get(key), policy));
      } else {
        // ✅ MISSING DAY → GENERATE STATUS
        const today = new Date();

        const isAfterOfficeEnd =
          getDayStart(current) < getDayStart(today) ||
          today > buildTimeForDate(current, policy.officeEndTime);

        const status = isAfterOfficeEnd ? "absent" : "not_checked_in";

        allDays.push({
          _id: key,
          date: new Date(current),
          checkIn: null,
          checkOut: null,
          workingHours: 0,
          status,
        });
      }

      current.setDate(current.getDate() + 1);
    }
    allDays.reverse();
  }

  // ✅ apply pagination manually
  const total = allDays.length;
  const paginatedData = allDays.slice(skip, skip + l);

  return buildPaginationResult({
    data: paginatedData,
    total,
    page: p,
    limit: l,
  });
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
  const { page, limit, skip } = getPagination(filters);
  const shouldPaginate = Boolean(filters.page || filters.limit);

  const status = filters.status ? String(filters.status) : "";

  const policy = await getAttendancePolicy();

  const targetDate = filters.date ? new Date(filters.date) : new Date();
  const today = new Date();

  // ✅ BLOCK FUTURE DATE FIRST
  const todayStart = getDayStart(today);
  if (getDayStart(targetDate) > todayStart) {
    return buildPaginationResult({
      data: [],
      total: 0,
      page,
      limit,
    });
  }

  // ✅ OFFICE TIME BASED ON TARGET DATE
  const officeEndTime = buildTimeForDate(targetDate, policy.officeEndTime);

  // ✅ CHECK PAST DATE
  const isPastDate = targetDate < todayStart;

  // ✅ FINAL STATUS DECISION
  const isAfterOfficeEnd = isPastDate || today > officeEndTime;

  const dayStart = getDayStart(targetDate);
  const dayEnd = getDayEnd(targetDate);

  if (
    filters.employeeId &&
    !mongoose.Types.ObjectId.isValid(filters.employeeId)
  ) {
    throw new AppError("Invalid employee id", 400);
  }

  // 🔥 ALWAYS START FROM EMPLOYEES (FIX)
  const employeeMatch = {};

  if (filters.employeeId) {
    employeeMatch._id = new mongoose.Types.ObjectId(filters.employeeId);
  }

  if (filters.department) {
    employeeMatch.department = filters.department.trim();
  }

  // 1. Get all employees
  const employees = await Employee.find(employeeMatch)
    .select("_id name employeeCode department")
    .sort({ name: 1 });

  // 2. Get attendance for selected date
  const attendanceRecords = await Attendance.find({
    date: { $gte: dayStart, $lte: dayEnd },
  }).lean();

  // 3. Map attendance
  const attendanceMap = new Map();
  attendanceRecords.forEach((att) => {
    attendanceMap.set(att.employee.toString(), att);
  });

  // 4. Merge employees + attendance
  let merged = employees.map((emp) => {
    const record = attendanceMap.get(emp._id.toString());

    if (record) {
      return {
        _id: record._id,
        employee: emp,
        date: record.date,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        checkInStatus: record.checkInStatus,
        workingHours: record.workingHours,
        createdAt: record.createdAt,
        status: getStatus(record, isAfterOfficeEnd, policy),
      };
    }

    // 🔥 NO RECORD → STILL RETURN
    return {
      _id: `${emp._id}-${dayStart.toISOString()}`,
      employee: emp,
      date: dayStart,
      checkIn: null,
      checkOut: null,
      checkInStatus: null,
      workingHours: 0,
      createdAt: dayStart,
      status: isAfterOfficeEnd ? "absent" : "not_checked_in",
    };
  });

  // 🔥 APPLY STATUS FILTER
  if (filters.status) {
    merged = merged.filter((item) => item.status === filters.status);
  }

  // 🔥 PAGINATION
  const total = merged.length;

  if (shouldPaginate) {
    merged = merged.slice(skip, skip + limit);
  }

  return buildPaginationResult({
    data: merged,
    total,
    page,
    limit,
  });
};

function getStatus(record, isAfterOfficeEnd, policy) {
  if (!record.checkIn) {
    return isAfterOfficeEnd ? "absent" : "not_checked_in";
  }

  const officeStart = buildTimeForDate(record.date, policy.officeStartTime);
  const officeEnd = buildTimeForDate(record.date, policy.officeEndTime);

  const fullDayHours =
    (officeEnd.getTime() - officeStart.getTime()) / (1000 * 60 * 60);

  // ✅ Half Day FIRST
  if (record.workingHours > 0 && record.workingHours < policy.halfDayHours) {
    return "half_day";
  }

  // ✅ Early Leave AFTER
  if (record.checkOut && record.workingHours < fullDayHours) {
    return "early_leave";
  }

  if (record.checkInStatus === "grace_late") return "grace_late";
  if (record.checkInStatus === "late") return "late";

  return "present";
}

const updateAttendancePolicy = async ({ payload }) => {
  const allowedFields = [
    "officeStartTime",
    "onTimeLimit",
    "graceLateLimit",
    "officeEndTime",
    "halfDayHours",
    "autoCheckoutEnabled",
  ];
  const update = {};

  allowedFields.forEach((key) => {
    if (payload[key] !== undefined) {
      update[key] = payload[key];
    }
  });

  if (update.halfDayHours !== undefined) {
    const parsedHours = Number(update.halfDayHours);
    if (Number.isNaN(parsedHours)) {
      delete update.halfDayHours;
    } else {
      update.halfDayHours = parsedHours;
    }
  }

  const policy = await AttendancePolicy.findOneAndUpdate({}, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  await scheduleAutoCheckout();

  return policy;
};

const getAttendanceDashboard = async () => {
  const policy = await getAttendancePolicy();
  const now = new Date();

  const dayStart = getDayStart(now);
  const dayEnd = getDayEnd(now);

  const officeEnd = buildTimeForDate(now, policy.officeEndTime);

  const [totalEmployees, records] = await Promise.all([
    Employee.countDocuments(),
    Attendance.find({
      date: { $gte: dayStart, $lte: dayEnd },
      checkIn: { $ne: null },
    }).select("checkInStatus"),
  ]);

  const late = records.filter(
    (record) =>
      record.checkInStatus === "late" || record.checkInStatus === "grace_late",
  ).length;

  const present = records.filter(
    (record) =>
      record.checkInStatus !== "late" && record.checkInStatus !== "grace_late",
  ).length;

  const missing = Math.max(0, totalEmployees - records.length);

  const isAfterOfficeEnd = now > officeEnd;

  // ✅ AUTO CHECKOUT SAFE

  return {
    totalEmployees,
    present,
    late,
    notCheckedIn: isAfterOfficeEnd ? 0 : missing,
    absent: isAfterOfficeEnd ? missing : 0,
  };
};

module.exports = {
  checkIn,
  checkOut,
  listMyAttendance,
  listAttendanceForEmployee,
  listAttendanceForAdmin,
  getAttendancePolicy,
  updateAttendancePolicy,
  getAttendanceDashboard,
};
