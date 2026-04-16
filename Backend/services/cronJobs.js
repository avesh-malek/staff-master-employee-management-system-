const cron = require("node-cron");
const Attendance = require("../models/Attendance");
const AttendancePolicy = require("../models/AttendancePolicy");

const { buildTimeForDate } = require("../utils/attendanceStatus");

let autoCheckoutJob = null; // 🔥 store current job

// ✅ FIX — IST-aware (same as attendanceService.js)
const toIST = (date = new Date()) => {
  const utcMs = new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 60 * 60000);
};

const getDayStart = (date = new Date()) => {
  const ist = toIST(date);
  return new Date(Date.UTC(ist.getFullYear(), ist.getMonth(), ist.getDate(), -5, -30, 0, 0));
};

const getDayEnd = (date = new Date()) => {
  const ist = toIST(date);
  return new Date(Date.UTC(ist.getFullYear(), ist.getMonth(), ist.getDate(), 18, 29, 59, 999));
};


// 🔥 MAIN FUNCTION
const scheduleAutoCheckout = async () => {
  try {
    const policy = await AttendancePolicy.findOne();
    if (!policy || !policy.autoCheckoutEnabled) {
      console.log("⏸ Auto checkout disabled");

      if (autoCheckoutJob) {
        autoCheckoutJob.stop();
        autoCheckoutJob = null;
      }

      return;
    }
    // 🔥 Stop previous job if exists
    if (autoCheckoutJob) {
      autoCheckoutJob.stop();
      autoCheckoutJob = null;
    }

    const [hour, minute] = policy.officeEndTime.split(":");

    // 🧠 cron format: minute hour * * *
    const cronTime = `${minute} ${hour} * * *`;

    console.log(`🟢 Scheduling auto checkout at ${policy.officeEndTime}`);

    autoCheckoutJob = cron.schedule(
      cronTime,
      async () => {
        try {
          // ✅ STEP 1: fetch latest policy INSIDE cron
          const freshPolicy = await AttendancePolicy.findOne();

          const now = new Date();

          const dayStart = getDayStart(now);
          const dayEnd = getDayEnd(now);

          // ✅ STEP 2: use freshPolicy instead of old policy
          const officeEnd = buildTimeForDate(now, freshPolicy.officeEndTime);

          const records = await Attendance.find({
            date: { $gte: dayStart, $lte: dayEnd },
            checkIn: { $ne: null },
            checkOut: null,
          });

          let updatedCount = 0;

          for (const record of records) {
            if (record.checkIn > officeEnd) continue;

            const diffMs = officeEnd.getTime() - record.checkIn.getTime();

            const workingHours = Math.max(
              0,
              Number((diffMs / (1000 * 60 * 60)).toFixed(2)),
            );

            record.checkOut = officeEnd;
            record.workingHours = workingHours;
            record.autoCheckedOut = true;
            
            await record.save();
            updatedCount++;
          }

          console.log(`✅ Auto checkout done for ${updatedCount} employees`);
        } catch (err) {
          console.error("❌ Auto checkout error:", err.message);
        }
      },
      {
        timezone: "Asia/Kolkata", // ✅ optional but recommended
      },
    );
  } catch (err) {
    console.error("❌ Schedule error:", err.message);
  }
};

// 🔥 START ALL CRONS
const startCronJobs = async () => {
  console.log("🟢 Starting Cron Jobs...");
  await scheduleAutoCheckout();
};

module.exports = {
  startCronJobs,
  scheduleAutoCheckout, // 👈 IMPORTANT (we will use this later)
};
