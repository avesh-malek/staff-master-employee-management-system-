const asyncHandler = require("../middleware/asyncHandler");
const attendanceService = require("../services/attendanceService");

const checkIn = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkIn({ requester: req.user });
  return res.status(200).json(record);
});

const checkOut = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkOut({ requester: req.user });
  return res.status(200).json(record);
});

const getMyAttendance = asyncHandler(async (req, res) => {
  const records = await attendanceService.listMyAttendance({
    requester: req.user,
    month: req.query.month,
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status, // ✅ ADD THIS LINE
  });

  return res.status(200).json(records);
});

const getAttendanceByEmployee = asyncHandler(async (req, res) => {
  const records = await attendanceService.listAttendanceForEmployee({
    employeeId: req.params.id,
    month: req.query.month,
  });

  return res.status(200).json(records);
});

const getAttendanceAdmin = asyncHandler(async (req, res) => {
  const records = await attendanceService.listAttendanceForAdmin({
    filters: {
      employeeId: req.query.employeeId,
      date: req.query.date,
      department: req.query.department,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    },
  });

  return res.status(200).json(records);
});

const getAttendancePolicy = asyncHandler(async (req, res) => {
  const policy = await attendanceService.getAttendancePolicy();
  return res.status(200).json(policy);
});

const updateAttendancePolicy = asyncHandler(async (req, res) => {
  const policy = await attendanceService.updateAttendancePolicy({
    payload: req.body,
  });
  return res.status(200).json(policy);
});

const getAttendanceDashboard = asyncHandler(async (req, res) => {
  const data = await attendanceService.getAttendanceDashboard();
  return res.status(200).json(data);
});

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceByEmployee,
  getAttendanceAdmin,
  getAttendancePolicy,
  updateAttendancePolicy,
  getAttendanceDashboard,
};
