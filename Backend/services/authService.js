const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { generateRandomToken, hashToken, signAccessToken } = require("../utils/token");
const {
  sendPasswordResetEmail,
} = require("./notificationService");

const isProduction = () => process.env.NODE_ENV === "production";

const formatAuthUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  employeeId: user.employee?._id || null,
  employeeCode: user.employee?.employeeCode || null,
  employeeName: user.employee?.name || null,
});

const signUserToken = (user) =>
  signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

const getLoginErrorMessage = (type) => {
  if (isProduction()) return "Invalid credentials";
  if (type === "email") return "Email not found";
  if (type === "password") return "Incorrect password";
  return "Invalid credentials";
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail })
    .populate("employee")
    .select("+password");

  if (!user || user.deletedAt) {
    throw new AppError(getLoginErrorMessage("email"), 401);
  }

  if (!user.password) {
    throw new AppError(getLoginErrorMessage("password"), 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(getLoginErrorMessage("password"), 401);
  }

  if (user.employmentStatus !== "active") {
    throw new AppError("Your account is not active. Please contact admin.", 403);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signUserToken(user);

  return {
    token,
    user: formatAuthUser(user),
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate("employee");

  if (!user || user.deletedAt) {
    throw new AppError("Unauthorized", 401);
  }

  if (user.employmentStatus !== "active") {
    throw new AppError("Unauthorized", 401);
  }

  return formatAuthUser(user);
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail, deletedAt: null });

  if (!user) {
    return;
  }

  const rawToken = generateRandomToken();
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  await sendPasswordResetEmail({ email: user.email, resetToken: rawToken });
};

const applyNewPassword = async ({ user, password }) => {
  user.password = await bcrypt.hash(password, 12);
  user.passwordChangedAt = new Date();
  user.tokenVersion += 1;
  await user.save();
};

const resetPassword = async ({ token, password }) => {
  const hashed = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpiresAt: { $gt: new Date() },
    deletedAt: null,
  }).populate("employee");

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  await applyNewPassword({ user, password });

  user.passwordResetToken = null;
  user.passwordResetExpiresAt = null;
  await user.save();

  const authToken = signUserToken(user);

  return {
    token: authToken,
    user: formatAuthUser(user),
  };
};

const setPasswordFromSetupToken = async ({ token, password }) => {
  const hashed = hashToken(token);

  const user = await User.findOne({
    passwordSetupToken: hashed,
    passwordSetupExpiresAt: { $gt: new Date() },
    deletedAt: null,
  }).populate("employee");

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  await applyNewPassword({ user, password });

  user.passwordSetupToken = null;
  user.passwordSetupExpiresAt = null;
  await user.save();

  const authToken = signUserToken(user);

  return {
    token: authToken,
    user: formatAuthUser(user),
  };
};

const bootstrapAdmin = async ({ name, email, password, setupKey }) => {
  if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
    throw new AppError("Unauthorized", 401);
  }

  const existingAdmin = await User.findOne({ role: "admin", deletedAt: null });

  if (existingAdmin) {
    throw new AppError("Admin already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: "admin",
    employmentStatus: "active",
  });

  const token = signUserToken(user);

  return {
    token,
    user: formatAuthUser(user),
  };
};

module.exports = {
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  setPasswordFromSetupToken,
  bootstrapAdmin,
};
