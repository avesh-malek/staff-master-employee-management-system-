const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    checkInStatus: {
      type: String,
      enum: ["on_time", "grace_late", "late"],
    },
    workingHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔥 ADD THIS
    autoCheckedOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
