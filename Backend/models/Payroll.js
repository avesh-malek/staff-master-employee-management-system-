const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      index: true,
    },
    basic: {
      type: Number,
      required: true,
      min: 0,
    },
    hra: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    allowance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    bonus: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    pf: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    leaveDeduction: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "paid"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: "",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    transactionId: {
      type: String,
      trim: true,
      default: "",
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    payslipId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);
