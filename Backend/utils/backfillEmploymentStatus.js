const Employee = require("../models/Employee");
const User = require("../models/User");

const backfillEmploymentStatus = async () => {
  await Employee.collection.updateMany(
    { employmentStatus: { $exists: false } },
    [{ $set: { employmentStatus: { $ifNull: ["$isActive", true] } } }]
  );

  await Employee.collection.updateMany(
    { isActive: { $exists: true } },
    { $unset: { isActive: "" } }
  );

  await User.collection.updateMany(
    { employmentStatus: { $exists: false } },
    [{ $set: { employmentStatus: { $ifNull: ["$isActive", true] } } }]
  );

  await User.collection.updateMany(
    { isActive: { $exists: true } },
    { $unset: { isActive: "" } }
  );
};

module.exports = backfillEmploymentStatus;
