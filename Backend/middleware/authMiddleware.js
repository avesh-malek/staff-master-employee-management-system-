const User = require("../models/User");
const AppError = require("../utils/appError");
const { verifyAccessToken } = require("../utils/token");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized", 401));
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub)
      .populate("employee")
      .select("+password");

    if (!user || user.deletedAt || user.employmentStatus !== "active") {
      return next(new AppError("Unauthorized", 401));
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = {
      id: user._id,
      role: user.role,
      employeeId: user.employee ? user.employee._id : null,
      employeeCode: user.employee ? user.employee.employeeCode : null,
      email: user.email,
      name: user.name,
    };

    return next();
  } catch (error) {
    return next(new AppError("Unauthorized", 401));
  }
};

module.exports = { protect };
