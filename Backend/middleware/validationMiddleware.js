const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Invalid or missing input data",
    });
  }

  return next();
};

module.exports = {
  handleValidationErrors,
};
