const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const migrateEmploymentStatus = async () => {
  try {
    await connectDB();

    const result = await User.updateMany(
      { employmentStatus: { $type: "bool" } },
      [
        {
          $set: {
            employmentStatus: {
              $cond: [{ $eq: ["$employmentStatus", true] }, "active", "inactive"],
            },
          },
        },
      ]
    );

    console.log(`Matched: ${result.matchedCount}, Updated: ${result.modifiedCount}`);
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

migrateEmploymentStatus();
