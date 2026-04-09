const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/appError");
const payrollService = require("../services/payrollService");
const {
  generatePayslipPdf,
  getPayslipFilename,
} = require("../services/pdfService");
const { streamPayrollZip } = require("../services/zipService");

const getMonthYearFromValue = (value) => {
  if (!value) return {};

  const [year, month] = String(value).split("-").map(Number);
  return { month, year };
};

const generatePayroll = asyncHandler(async (req, res) => {
  const monthYear = getMonthYearFromValue(req.body.period);

const month = req.body.month ?? monthYear.month;
const year = req.body.year ?? monthYear.year;

if (month == null || year == null) {
  throw new AppError("Month and year are required", 400);
}
const result = await payrollService.generatePayroll({ month, year });

  return res.status(201).json({
    message:
      result.createdCount > 0
        ? "Payroll generated successfully"
        : "Payroll already exists for all employees",
    ...result,
  });
});

const getPayroll = asyncHandler(async (req, res) => {
  const records = await payrollService.listPayroll({
    filters: {
      month: req.query.month,
      year: req.query.year,
      status: req.query.status,
      employeeId: req.query.employeeId,
      search: req.query.search,
    },
    pagination: {
      page: req.query.page,
      limit: req.query.limit,
    },
  });

  return res.status(200).json(records);
});

const getMyPayroll = asyncHandler(async (req, res) => {
  const records = await payrollService.listMyPayroll({
    requester: req.user,
    filters: {
      month: req.query.month,
      year: req.query.year,
      status: req.query.status,
    },
    pagination: {
      page: req.query.page,
      limit: req.query.limit,
    },
  });

  return res.status(200).json(records);
});

const payPayroll = asyncHandler(async (req, res) => {
  const record = await payrollService.markPayrollAsPaid({
    id: req.params.id,
    payload: {
      paymentMethod: req.body.paymentMethod,
      paymentDate: req.body.paymentDate,
      transactionId: req.body.transactionId,
    },
    actor: req.user,
  });

  return res.status(200).json(record);
});

const downloadPayslip = asyncHandler(async (req, res) => {
  const payroll = await payrollService.getPayrollForDownload({
    id: req.params.id,
    requester: req.user,
  });

  const pdfBuffer = await generatePayslipPdf(payroll);
  const filename = getPayslipFilename(payroll);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.status(200).send(pdfBuffer);
});

const bulkDownloadPayslips = asyncHandler(async (req, res) => {
  const filters = (({ month, year, status, employeeId, search }) => ({
  month,
  year,
  status,
  employeeId,
  search,
}))(req.body);

const payrolls = await payrollService.getPayrollsForBulkDownload({
  filters,
});

  if (!payrolls.length) {
    throw new AppError("No payroll records available for download", 404);
  }

  const monthPart = req.body.month
    ? String(Number(req.body.month)).padStart(2, "0")
    : "all";
  const yearPart = req.body.year || "all";

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="Payslips_${yearPart}_${monthPart}.zip"`,
  );

  await streamPayrollZip({ payrolls, res });
});

module.exports = {
  generatePayroll,
  getPayroll,
  getMyPayroll,
  payPayroll,
  downloadPayslip,
  bulkDownloadPayslips,
};
