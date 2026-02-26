const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in environment");
    }

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
