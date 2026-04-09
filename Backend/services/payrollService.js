const mongoose = require("mongoose");
const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const AppError = require("../utils/appError");
const { getPagination, buildPaginationResult } = require("../utils/pagination");

const roundAmount = (value) => Number(Number(value || 0).toFixed(2));

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateMonthYear = ({ month, year }) => {
  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    throw new AppError("Invalid month", 400);
  }

  if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
    throw new AppError("Invalid year", 400);
  }

  return { month: parsedMonth, year: parsedYear };
};

const buildPayrollBreakdown = (salary) => {
  const baseSalary = roundAmount(salary);
  const basic = roundAmount(baseSalary * 0.5);
  const hra = roundAmount(baseSalary * 0.2);
  const allowance = roundAmount(baseSalary - basic - hra);
  const bonus = 0;
  const pf = 0;
  const tax = 0;
  const leaveDeduction = 0;
  const netSalary = roundAmount(
    basic + hra + allowance + bonus - pf - tax - leaveDeduction,
  );

  return {
    basic,
    hra,
    allowance,
    bonus,
    pf,
    tax,
    leaveDeduction,
    netSalary,
  };
};

const buildPayslipId = ({ year, month, sequence }) =>
  `PSL-${year}-${String(month).padStart(2, "0")}-${String(sequence).padStart(4, "0")}`;

const buildAdminQuery = async ({ filters = {} }) => {
  const query = {};

  if (filters.month !== undefined && filters.month !== "") {
    query.month = Number(filters.month);
  }

  if (filters.year !== undefined && filters.year !== "") {
    query.year = Number(filters.year);
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.employeeId) {
    if (!mongoose.Types.ObjectId.isValid(filters.employeeId)) {
      throw new AppError("Invalid employee id", 400);
    }

    query.employee = new mongoose.Types.ObjectId(filters.employeeId);
  }

  if (filters.search) {
    const pattern = new RegExp(escapeRegex(filters.search.trim()), "i");
    const employees = await Employee.find({
      $or: [{ name: pattern }, { email: pattern }],
    }).select("_id");

    const employeeIds = employees.map((employee) => employee._id);

    if (!employeeIds.length) {
      query.employee = { $in: [] };
    } else if (query.employee) {
      const employeeId = String(query.employee);
      if (!employeeIds.some((id) => String(id) === employeeId)) {
        query.employee = { $in: [] };
      }
    } else {
      query.employee = { $in: employeeIds };
    }
  }

  return query;
};

const listPayroll = async ({ filters = {}, pagination = {} }) => {
  const query = await buildAdminQuery({ filters });
  const { page, limit, skip } = getPagination(pagination);

  const [records, total] = await Promise.all([
    Payroll.find(query)
      .populate("employee", "name email employeeCode department designation")
      .populate("paidBy", "name email")
      .sort({ year: -1, month: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payroll.countDocuments(query),
  ]);

  const summaryAgg = await Payroll.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalSalary: { $sum: "$netSalary" },
        paid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        draft: {
          $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    ...buildPaginationResult({
      data: records,
      total,
      page,
      limit,
    }),
    summary: summaryAgg[0] || {
      totalSalary: 0,
      paid: 0,
      pending: 0,
      draft: 0,
    },
  };
};

const listMyPayroll = async ({ requester, filters = {}, pagination = {} }) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const query = {
    employee: requester.employeeId,
  };

  if (filters.month !== undefined && filters.month !== "") {
    query.month = Number(filters.month);
  }

  if (filters.year !== undefined && filters.year !== "") {
    query.year = Number(filters.year);
  }

  if (filters.status) {
    query.status = filters.status;
  }

  const { page, limit, skip } = getPagination(pagination);

  const [records, total] = await Promise.all([
    Payroll.find(query)
      .populate("employee", "name email employeeCode department designation")
      .populate("paidBy", "name email")
      .sort({ year: -1, month: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Payroll.countDocuments(query),
  ]);

  return buildPaginationResult({
    data: records,
    total,
    page,
    limit,
  });
};

const generatePayroll = async ({ month, year }) => {
  const normalized = validateMonthYear({ month, year });

  const [employees, existingPayrolls] = await Promise.all([
    Employee.find().select("_id salary name"),
    Payroll.find({
      month: normalized.month,
      year: normalized.year,
    }).select("employee"),
  ]);

  if (!employees.length) {
    throw new AppError("No employees found for payroll generation", 404);
  }

  const existingEmployeeIds = new Set(
    existingPayrolls.map((payroll) => String(payroll.employee)),
  );

  let sequence = existingPayrolls.length;
  const documents = [];

  employees.forEach((employee) => {
    if (existingEmployeeIds.has(String(employee._id))) {
      return;
    }

    sequence += 1;

    documents.push({
      employee: employee._id,
      month: normalized.month,
      year: normalized.year,
      ...buildPayrollBreakdown(employee.salary || 0),
      status: "pending",
      payslipId: buildPayslipId({
        year: normalized.year,
        month: normalized.month,
        sequence,
      }),
    });
  });

  if (!documents.length) {
    return {
      createdCount: 0,
      skippedCount: employees.length,
      records: [],
    };
  }

  const records = await Payroll.insertMany(documents, { ordered: false });

  return {
    createdCount: records.length,
    skippedCount: employees.length - records.length,
    records,
  };
};

const markPayrollAsPaid = async ({ id, payload, actor }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid payroll id", 400);
  }

  const payroll = await Payroll.findById(id).populate(
    "employee",
    "name email employeeCode department designation",
  );

  if (!payroll) {
    throw new AppError("Payroll record not found", 404);
  }

  if (payroll.status === "paid") {
    throw new AppError("Payroll is already marked as paid", 400);
  }

  payroll.status = "paid";
  payroll.paymentMethod = payload.paymentMethod.trim();
  payroll.paymentDate = payload.paymentDate
    ? new Date(payload.paymentDate)
    : new Date();
  payroll.transactionId = payload.transactionId?.trim() || "";
  payroll.paidBy = actor.id;

  await payroll.save();
  await payroll.populate("paidBy", "name email");

  return payroll;
};

const getPayrollById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid payroll id", 400);
  }

  const payroll = await Payroll.findById(id)
    .populate("employee", "name email employeeCode department designation")
    .populate("paidBy", "name email");

  if (!payroll) {
    throw new AppError("Payroll record not found", 404);
  }

  return payroll;
};

const assertPayrollDownloadAccess = ({ payroll, requester }) => {
  if (payroll.status !== "paid") {
    throw new AppError("Payslip is available only for paid payroll", 400);
  }

  if (
    requester.role === "employee" &&
    String(payroll.employee?._id) !== String(requester.employeeId)
  ) {
    throw new AppError("Forbidden", 403);
  }

  if (!["admin", "employee"].includes(requester.role)) {
    throw new AppError("Forbidden", 403);
  }
};

const getPayrollForDownload = async ({ id, requester }) => {
  const payroll = await getPayrollById(id);
  assertPayrollDownloadAccess({ payroll, requester });
  return payroll;
};

const getPayrollsForBulkDownload = async ({ filters = {} }) => {
  const query = await buildAdminQuery({ filters });
  const payrolls = await Payroll.find(query)
    .populate("employee", "name email employeeCode department designation")
    .populate("paidBy", "name email")
    .sort({ year: -1, month: -1, createdAt: -1 });

  const paidPayrolls = payrolls.filter((payroll) => payroll.status === "paid");

  if (!paidPayrolls.length) {
    throw new AppError("No paid payroll records found for download", 404);
  }

  return paidPayrolls;
};

const getMonthLabel = (month, year) =>
  `${monthNames[Number(month) - 1] || "Month"} ${year}`;

module.exports = {
  generatePayroll,
  listPayroll,
  listMyPayroll,
  markPayrollAsPaid,
  getPayrollForDownload,
  getPayrollsForBulkDownload,
  getMonthLabel,
};
