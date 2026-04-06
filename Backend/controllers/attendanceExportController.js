const asyncHandler = require("../middleware/asyncHandler");
const {
  buildMyAttendanceWorkbook,
  buildAdminAttendanceWorkbook,
} = require("../services/attendanceExportService");

const sendWorkbook = async (res, workbook) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="attendance.xlsx"',
  );

  await workbook.xlsx.write(res);
  res.end();
};

const exportMyAttendance = asyncHandler(async (req, res) => {
  const workbook = await buildMyAttendanceWorkbook({
    requester: req.user,
    filters: {
      month: req.query.month,
      status: req.query.status,
    },
  });

  await sendWorkbook(res, workbook);
});

const exportAdminAttendance = asyncHandler(async (req, res) => {
  const workbook = await buildAdminAttendanceWorkbook({
    filters: {
      employeeId: req.query.employeeId,
      date: req.query.date,
      from: req.query.from,
      to: req.query.to,
      department: req.query.department,
      status: req.query.status,
    },
  });

  await sendWorkbook(res, workbook);
});

module.exports = {
  exportMyAttendance,
  exportAdminAttendance,
};
