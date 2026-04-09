const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};
    let firstMessage = null;

    errors.array().forEach((error) => {
      if (error.path) {
        formattedErrors[error.path] = error.msg;
      } else {
        // ✅ global error (like your custom validator)
        firstMessage = error.msg;
      }
    });

    return res.status(400).json({
      message: firstMessage || Object.values(formattedErrors)[0] || "Validation failed",
      errors: formattedErrors,
    });
  }

  return next();
};

module.exports = {
  handleValidationErrors,
};