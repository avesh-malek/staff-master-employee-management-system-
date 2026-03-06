const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};

    errors.array().forEach((error) => {
      formattedErrors[error.path] = error.msg;  
    });

    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  return next();
};

module.exports = {
  handleValidationErrors,
};
