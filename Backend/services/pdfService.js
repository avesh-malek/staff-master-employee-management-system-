const PDFDocument = require("pdfkit");
const { getMonthLabel } = require("./payrollService");

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const sanitizeFilename = (value) =>
  String(value || "Employee").replace(/[^a-z0-9_-]+/gi, "_");

const getPayslipFilename = (payroll) => {
  const employeeName = sanitizeFilename(payroll.employee?.name || "Employee");
  return `Payslip_${employeeName}_${String(payroll.month).padStart(2, "0")}_${payroll.year}.pdf`;
};

const drawPair = (doc, label, value, x, y) => {
  doc.font("Helvetica-Bold").text(label, x, y);
  doc.font("Helvetica").text(value, x + 120, y);
};

const drawBreakdownTable = (doc, payroll, startY) => {
  const rows = [
    ["Basic", formatCurrency(payroll.basic), "PF", formatCurrency(payroll.pf)],
    ["HRA", formatCurrency(payroll.hra), "Tax", formatCurrency(payroll.tax)],
    [
      "Allowance",
      formatCurrency(payroll.allowance),
      "Leave Deduction",
      formatCurrency(payroll.leaveDeduction),
    ],
    ["Bonus", formatCurrency(payroll.bonus), "", ""],
  ];

  const columnX = [50, 180, 320, 450];
  let y = startY;

  doc.font("Helvetica-Bold");
  doc.text("Earnings", columnX[0], y);
  doc.text("Amount", columnX[1], y);
  doc.text("Deductions", columnX[2], y);
  doc.text("Amount", columnX[3], y);
  y += 20;

  doc.moveTo(50, y - 4).lineTo(560, y - 4).strokeColor("#d1d5db").stroke();

  rows.forEach((row) => {
    doc.font("Helvetica").fillColor("#111827");
    doc.text(row[0], columnX[0], y);
    doc.text(row[1], columnX[1], y);
    doc.text(row[2], columnX[2], y);
    doc.text(row[3], columnX[3], y);
    y += 22;
  });

  return y;
};

const generatePayslipPdf = (payroll) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fontSize(20)
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .text("Employee Management System", { align: "center" });
    doc
      .moveDown(0.3)
      .fontSize(11)
      .fillColor("#475569")
      .font("Helvetica")
      .text("Payroll Payslip", { align: "center" });

    doc
      .moveDown(1)
      .roundedRect(50, 110, 510, 80, 10)
      .fillAndStroke("#f8fafc", "#cbd5e1");

    drawPair(doc, "Payslip ID", payroll.payslipId, 65, 128);
    drawPair(
      doc,
      "Salary Period",
      getMonthLabel(payroll.month, payroll.year),
      65,
      150,
    );
    drawPair(doc, "Status", payroll.status.toUpperCase(), 330, 128);
    drawPair(
      doc,
      "Payment Date",
      payroll.paymentDate
        ? new Date(payroll.paymentDate).toLocaleDateString()
        : "-",
      330,
      150,
    );

    doc
      .moveDown(4)
      .fontSize(14)
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .text("Employee Details");

    drawPair(doc, "Name", payroll.employee?.name || "-", 50, 235);
    drawPair(doc, "Employee Code", payroll.employee?.employeeCode || "-", 50, 257);
    drawPair(doc, "Email", payroll.employee?.email || "-", 50, 279);
    drawPair(doc, "Department", payroll.employee?.department || "-", 320, 235);
    drawPair(
      doc,
      "Designation",
      payroll.employee?.designation || "-",
      320,
      257,
    );
    drawPair(
      doc,
      "Payment Method",
      payroll.paymentMethod || "-",
      320,
      279,
    );

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text("Salary Breakdown", 50, 325);

    const endY = drawBreakdownTable(doc, payroll, 350);

    doc
      .roundedRect(50, endY + 20, 510, 60, 10)
      .fillAndStroke("#ecfeff", "#67e8f9");

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text("Net Salary", 70, endY + 40);
    doc
      .fontSize(18)
      .text(formatCurrency(payroll.netSalary), 400, endY + 35, {
        width: 130,
        align: "right",
      });

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#475569")
      .text(`Transaction ID: ${payroll.transactionId || "-"}`, 50, endY + 100)
      .text(`Processed By: ${payroll.paidBy?.name || "-"}`, 50, endY + 120)
      .text("This is a system generated payslip.", 50, 760, {
        align: "center",
      });

    doc.end();
  });

module.exports = {
  generatePayslipPdf,
  getPayslipFilename,
};
