const AppError = require("../utils/appError");

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError("Forbidden", 403));
  }

  return next();
};

module.exports = authorizeRoles;
