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
    },
  });

  return res.status(200).json(records);
});

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAttendanceByEmployee,
  getAttendanceAdmin,
};
