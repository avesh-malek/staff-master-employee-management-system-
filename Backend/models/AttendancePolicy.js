const mongoose = require("mongoose");

const attendancePolicySchema = new mongoose.Schema(
  {
    officeStartTime: {
      type: String,
      default: "09:00",
      trim: true,
    },
    onTimeLimit: {
      type: String,
      default: "09:20",
      trim: true,
    },
    graceLateLimit: {
      type: String,
      default: "09:40",
      trim: true,
    },
    officeEndTime: {
      type: String,
      default: "18:00",
      trim: true,
    },
    halfDayHours: {
      type: Number,
      default: 4,
      min: 0,
    },
    autoCheckoutEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

module.exports = mongoose.model("AttendancePolicy", attendancePolicySchema);
