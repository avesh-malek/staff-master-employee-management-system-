const ExcelJS = require("exceljs");
const {
  getMyAttendanceData,
  getAdminAttendanceData,
} = require("./attendanceService");

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "-";

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString() : "-";

const formatHours = (hours) => {
  if (!hours) return "-";

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  return `${wholeHours}h ${minutes}m`;
};

const formatStatus = (status) => {
  if (!status) return "-";

  const labels = [];

  if (status.base === "present") labels.push("Present");
  if (status.base === "present_late") labels.push("Present (Late)");
  if (status.base === "present_grace") labels.push("Present (Grace Late)");
  if (status.base === "absent") labels.push("Absent");
  if (status.base === "not_checked_in") labels.push("Not Checked-In");

  if (status.modifiers?.includes("half_day")) labels.push("Half Day");
  if (status.modifiers?.includes("early_leave")) labels.push("Early Leave");

  return labels.join(" | ") || "-";
};

const createWorkbook = (sheetName, columns) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns;

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.columns.forEach((column) => {
    column.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true, 
    };
  });

  return { workbook, worksheet };
};
const buildMyAttendanceWorkbook = async ({ requester, filters }) => {
  const records = await getMyAttendanceData({
    requester,
    month: filters.month,
    status: filters.status,
  });

  const { workbook, worksheet } = createWorkbook("My Attendance", [
    { header: "Date", key: "date", width: 16 },
    { header: "Check In", key: "checkIn", width: 15 },
    { header: "Check Out", key: "checkOut", width: 15 },
    { header: "Working Hours", key: "workingHours", width: 15 },
    { header: "Status", key: "status", width: 22 },
  ]);

  records.forEach((record) => {
    worksheet.addRow({
      date: formatDate(record.date),
      checkIn: formatTime(record.checkIn),
      checkOut: formatTime(record.checkOut),
      workingHours: formatHours(record.workingHours),
      status: formatStatus(record.status),
    });
  });

  return workbook;
};

const buildAdminAttendanceWorkbook = async ({ filters }) => {
  const records = await getAdminAttendanceData({ filters });

  const { workbook, worksheet } = createWorkbook("Attendance", [
    { header: "Employee", key: "employee", width: 26 },
    { header: "Department", key: "department", width: 13 },
    { header: "Date", key: "date", width: 15 },
    { header: "Check In", key: "checkIn", width: 15 },
    { header: "Check Out", key: "checkOut", width: 15 },
    { header: "Working Hours", key: "workingHours", width: 15 },
    { header: "Status", key: "status", width: 22 },
  ]);

  records.forEach((record) => {
    worksheet.addRow({
      employee: record.employee
        ? `${record.employee.name} (${record.employee.employeeCode})`
        : "-",
      department: record.employee?.department || "-",
      date: formatDate(record.date),
      checkIn: formatTime(record.checkIn),
      checkOut: formatTime(record.checkOut),
      workingHours: formatHours(record.workingHours),
      status: formatStatus(record.status),
    });
  });

  return workbook;
};

module.exports = {
  buildMyAttendanceWorkbook,
  buildAdminAttendanceWorkbook,
};
