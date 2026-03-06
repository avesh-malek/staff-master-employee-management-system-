const AppError = require("../utils/appError");

const notFound = (req, res, next) => {
  next(new AppError("Route not found", 404));
};

const errorHandler = (err, req, res, next) => {
  // Multer error
  if (err.name === "MulterError" || err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Invalid or missing input data",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  // Cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Server error" });
};

module.exports = {
  notFound,
  errorHandler,
};
