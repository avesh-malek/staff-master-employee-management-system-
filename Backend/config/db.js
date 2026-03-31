const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ DB Connected");
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    process.exit(1);
  }
};

module.exports = connectDB;