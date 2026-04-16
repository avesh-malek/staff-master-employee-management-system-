const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const AttendancePolicy = require("../models/AttendancePolicy");
const Employee = require("../models/Employee");
const AppError = require("../utils/appError");
const { getPagination, buildPaginationResult } = require("../utils/pagination");
const { scheduleAutoCheckout } = require("./cronJobs");
const { getStatus, buildTimeForDate } = require("../utils/attendanceStatus");

const toIST = (date = new Date()) => {
  const utcMs = new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 60 * 60000);
};

const getDayStart = (date = new Date()) => {
  const ist = toIST(date);
  // IST midnight in UTC = previous day 18:30 UTC
  return new Date(Date.UTC(ist.getFullYear(), ist.getMonth(), ist.getDate(), -5, -30, 0, 0));
};

const getDayEnd = (date = new Date()) => {
  const ist = toIST(date);
  return new Date(Date.UTC(ist.getFullYear(), ist.getMonth(), ist.getDate(), 18, 29, 59, 999));
};

const getDateKey = (date) => getDayStart(date).toISOString();

const buildStatusContext = (date, policy) => {
  const now = new Date();
  const normalizedDate = getDayStart(date);
  const officeEnd = buildTimeForDate(normalizedDate, policy.officeEndTime);

  return (
    getDayStart(normalizedDate) < getDayStart(now) || now > officeEnd
  );
};

const getAttendancePolicy = async () => {
  let policy = await AttendancePolicy.findOne();

  if (!policy) {
    policy = await AttendancePolicy.create({});
  }

  return policy;
};

const formatAttendance = (record, policy) => ({
  _id: record._id,
  employee: record.employee,
  date: record.date,
  checkIn: record.checkIn,
  checkOut: record.checkOut,
  checkInStatus: record.checkInStatus,
  workingHours: record.workingHours,
  createdAt: record.createdAt,
  status: getStatus(record, buildStatusContext(record.date, policy), policy),
});

const buildGeneratedAttendance = ({ employee = null, date, policy }) => {
  const normalizedDate = getDayStart(date);
  const status = buildStatusContext(normalizedDate, policy)
    ? { base: "absent", modifiers: [] }
    : { base: "not_checked_in", modifiers: [] };

  return {
    _id: employee
      ? `${employee._id}-${getDateKey(normalizedDate)}`
      : getDateKey(normalizedDate),
    employee,
    date: normalizedDate,
    checkIn: null,
    checkOut: null,
    checkInStatus: null,
    workingHours: 0,
    createdAt: normalizedDate,
    status,
  };
};

const getMonthDateRange = (month) => {
  const [year, monthIndex] = String(month)
    .split("-")
    .map(Number);

  const start = new Date(year, monthIndex - 1, 1);
  const end = new Date(year, monthIndex, 0, 23, 59, 59, 999);

  return { start, end };
};

const buildDateList = (start, end) => {
  const dates = [];
  const current = getDayStart(start);
  const finalDay = getDayStart(end);

  while (current <= finalDay) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const matchesStatusFilter = (item, status) => {
  if (!status) return true;

  if (status === "all_present") {
    return ["present", "present_late", "present_grace"].includes(
      item.status?.base,
    );
  }

  if (status === "half_day" || status === "early_leave") {
    return item.status?.modifiers?.includes(status);
  }

  return item.status?.base === status;
};

const applyStatusFilter = (records, status) =>
  records.filter((item) => matchesStatusFilter(item, status));

const getMyAttendanceData = async ({ requester, month, status }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const query = { employee: requester.employeeId };
  let dateRange = null;

  if (month) {
    dateRange = getMonthDateRange(month);
    query.date = { $gte: dateRange.start, $lte: dateRange.end };
  }

  const [dbRecords, policy] = await Promise.all([
    Attendance.find(query).sort({ date: -1 }),
    getAttendancePolicy(),
  ]);

  if (!dateRange) {
    return applyStatusFilter(
      dbRecords.map((record) => formatAttendance(record, policy)),
      status,
    );
  }

  const today = getDayEnd(new Date());
  const effectiveEnd = dateRange.end > today ? today : dateRange.end;

  if (getDayStart(dateRange.start) > getDayStart(effectiveEnd)) {
    return [];
  }

  const recordMap = new Map();
  dbRecords.forEach((record) => {
    recordMap.set(getDateKey(record.date), record);
  });

  const records = buildDateList(dateRange.start, effectiveEnd).map((date) => {
    const existing = recordMap.get(getDateKey(date));
    return existing
      ? formatAttendance(existing, policy)
      : buildGeneratedAttendance({ date, policy });
  });

  records.reverse();

  return applyStatusFilter(records, status);
};

const checkIn = async ({ requester }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const dayStart = getDayStart();
  const dayEnd = getDayEnd();
  const policy = await getAttendancePolicy();
  const now = new Date();

  const officeStart = buildTimeForDate(now, policy.officeStartTime);
  const officeEnd = buildTimeForDate(now, policy.officeEndTime);

  if (now < officeStart) {
    throw new AppError("Cannot check in before office start", 400);
  }

  if (now > officeEnd) {
    throw new AppError("Cannot check in after office hours", 400);
  }

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

  return formatAttendance(record, policy);
};

const checkOut = async ({ requester }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const policy = await getAttendancePolicy();
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
  record.autoCheckedOut = false;

  const diffMs = record.checkOut.getTime() - record.checkIn.getTime();

  record.workingHours = Math.max(
    0,
    Number((diffMs / (1000 * 60 * 60)).toFixed(2)),
  );

  await record.save();

  return formatAttendance(record, policy);
};

const listMyAttendance = async ({ requester, month, page, limit, status }) => {
  const pagination = getPagination({ page, limit });
  const records = await getMyAttendanceData({
    requester,
    month,
    status,
  });

  return buildPaginationResult({
    data: records.slice(pagination.skip, pagination.skip + pagination.limit),
    total: records.length,
    page: pagination.page,
    limit: pagination.limit,
  });
};

const listAttendanceForEmployee = async ({ employeeId, month }) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new AppError("Invalid employee id", 400);
  }

  const query = { employee: employeeId };

  if (month) {
    const dateRange = getMonthDateRange(month);
    query.date = { $gte: dateRange.start, $lte: dateRange.end };
  }

  const [records, policy] = await Promise.all([
    Attendance.find(query).sort({ date: -1 }),
    getAttendancePolicy(),
  ]);

  return records.map((record) => formatAttendance(record, policy));
};

const resolveAdminDateRange = (filters = {}) => {
  if (filters.from && filters.to) {
    return {
      start: getDayStart(new Date(filters.from)),
      end: getDayEnd(new Date(filters.to)),
      isRange: true,
    };
  }

  if (filters.date) {
    const selectedDate = new Date(filters.date);
    return {
      start: getDayStart(selectedDate),
      end: getDayEnd(selectedDate),
      isRange: false,
    };
  }

  const today = new Date();
  return {
    start: getDayStart(today),
    end: getDayEnd(today),
    isRange: false,
  };
};

const buildAdminAttendanceRecord = ({ employee, record, date, policy }) => {
  if (record) {
    return {
      _id: record._id,
      employee: {
        _id: employee._id,
        name: employee.name,
        employeeCode: employee.employeeCode,
        department: employee.department,
      },
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      checkInStatus: record.checkInStatus,
      workingHours: record.workingHours,
      createdAt: record.createdAt,
      status: getStatus(record, buildStatusContext(date, policy), policy),
    };
  }

  return buildGeneratedAttendance({
    employee: {
      _id: employee._id,
      name: employee.name,
      employeeCode: employee.employeeCode,
      department: employee.department,
    },
    date,
    policy,
  });
};

const getAdminAttendanceData = async ({ filters = {} }) => {
  if (
    filters.employeeId &&
    !mongoose.Types.ObjectId.isValid(filters.employeeId)
  ) {
    throw new AppError("Invalid employee id", 400);
  }

  const policy = await getAttendancePolicy();
  const dateRange = resolveAdminDateRange(filters);
  const todayEnd = getDayEnd(new Date());

  if (dateRange.start > todayEnd) {
    return [];
  }

  const effectiveEnd = dateRange.end > todayEnd ? todayEnd : dateRange.end;

  if (dateRange.start > effectiveEnd) {
    return [];
  }

  const employeeMatch = {};

  if (filters.employeeId) {
    employeeMatch._id = new mongoose.Types.ObjectId(filters.employeeId);
  }

  if (filters.department) {
    employeeMatch.department = filters.department.trim();
  }

  const employees = await Employee.find(employeeMatch)
    .select("_id name employeeCode department")
    .sort({ name: 1 })
    .lean();

  if (!employees.length) {
    return [];
  }

  const employeeIds = employees.map((employee) => employee._id);
  const attendanceRecords = await Attendance.find({
    employee: { $in: employeeIds },
    date: { $gte: dateRange.start, $lte: effectiveEnd },
  }).lean();

  const attendanceMap = new Map();
  attendanceRecords.forEach((record) => {
    attendanceMap.set(
      `${record.employee.toString()}::${getDateKey(record.date)}`,
      record,
    );
  });

  const dateList = buildDateList(dateRange.start, effectiveEnd);
  const records = [];

  employees.forEach((employee) => {
    dateList.forEach((date) => {
      const key = `${employee._id.toString()}::${getDateKey(date)}`;
      records.push(
        buildAdminAttendanceRecord({
          employee,
          record: attendanceMap.get(key),
          date,
          policy,
        }),
      );
    });
  });

records.sort((a, b) => {
  const dateDiff = new Date(a.date) - new Date(b.date);
    if (dateDiff !== 0) return dateDiff;
    return String(a.employee?.name || "").localeCompare(
      String(b.employee?.name || ""),
    );
  });

  return applyStatusFilter(records, filters.status);
};

const listAttendanceForAdmin = async ({ filters }) => {
  const pagination = getPagination(filters);
  const records = await getAdminAttendanceData({ filters });

  return buildPaginationResult({
    data:
      filters.page || filters.limit
        ? records.slice(
            pagination.skip,
            pagination.skip + pagination.limit,
          )
        : records,
    total: records.length,
    page: pagination.page,
    limit: pagination.limit,
  });
};

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
  const today = new Date();
  const dayStart = getDayStart(today);
  const dayEnd = getDayEnd(today);
  const officeEnd = buildTimeForDate(today, policy.officeEndTime);

  const [totalEmployees, records] = await Promise.all([
    Employee.countDocuments(),
    Attendance.find({
      date: { $gte: dayStart, $lte: dayEnd },
      checkIn: { $ne: null },
    }).select("checkIn checkOut checkInStatus workingHours date autoCheckedOut"),
  ]);

  const isAfterOfficeEnd = today > officeEnd;

  let present = 0;
  let late = 0;
  let grace = 0;

  records.forEach((record) => {
    const status = getStatus(record, isAfterOfficeEnd, policy);

    if (["present", "present_late", "present_grace"].includes(status.base)) {
      present += 1;
    }

    if (status.base === "present_late") late += 1;
    if (status.base === "present_grace") grace += 1;
  });

  const missing = Math.max(0, totalEmployees - records.length);

  return {
    totalEmployees,
    present,
    late,
    grace,
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
  getMyAttendanceData,
  getAdminAttendanceData,
  getAttendancePolicy,
  updateAttendancePolicy,
  getAttendanceDashboard,
};
