
// ✅ FIX (IST-aware)
const buildTimeForDate = (date, timeValue) => {
  const [hours, minutes] = String(timeValue || "00:00").split(":").map(Number);

  // Build the time as IST by using UTC offset for Asia/Kolkata (+05:30)
  const d = new Date(date);
  
  // Get the date parts in IST
  const istOffset = 5.5 * 60; // minutes
  const utcMs = d.getTime() + d.getTimezoneOffset() * 60000; // normalize to UTC
  const istDate = new Date(utcMs + istOffset * 60000);
  
  // Set y/m/d in IST, apply desired HH:MM, then convert back to UTC
  const year = istDate.getFullYear();
  const month = istDate.getMonth();
  const day = istDate.getDate();

  // Construct in UTC: IST HH:MM minus 5:30
  const totalMinutesIST = hours * 60 + minutes;
  const totalMinutesUTC = totalMinutesIST - istOffset;
  const utcHours = Math.floor(totalMinutesUTC / 60);
  const utcMinutes = totalMinutesUTC % 60;

  return new Date(Date.UTC(year, month, day, utcHours, utcMinutes, 0, 0));
};

const getStatus = (record, isAfterOfficeEnd, policy) => {
  if (!record.checkIn) {
    return isAfterOfficeEnd
      ? { base: "absent", modifiers: [] }
      : { base: "not_checked_in", modifiers: [] };
  }

  const officeEnd = buildTimeForDate(record.date, policy.officeEndTime);

  let baseStatus = "present";

  if (record.checkInStatus === "late") {
    baseStatus = "present_late";
  } else if (record.checkInStatus === "grace_late") {
    baseStatus = "present_grace";
  }

  let modifiers = [];

// ✅ APPLY ONLY AFTER CHECKOUT
if (record.checkOut && record.workingHours < policy.halfDayHours) {
  modifiers.push("half_day");
}

  if (
    record.checkOut &&
    !record.autoCheckedOut &&
    record.workingHours >= policy.halfDayHours &&
    record.checkOut < officeEnd
  ) {
    modifiers.push("early_leave");
  }

  return {
    base: baseStatus,
    modifiers,
  };
};

module.exports = { getStatus, buildTimeForDate };