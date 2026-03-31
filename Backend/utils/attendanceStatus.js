const buildTimeForDate = (date, timeValue) => {
  const [hours, minutes] = String(timeValue || "00:00")
    .split(":")
    .map(Number);

  const d = new Date(date);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  return d;
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

  if (record.workingHours < policy.halfDayHours) {
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