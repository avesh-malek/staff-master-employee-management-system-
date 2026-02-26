const asyncHandler = require("../middleware/asyncHandler");
const authService = require("../services/authService");

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return res.status(200).json(result);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return res.status(200).json(user);
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);
  return res.status(200).json({
    message: "If this email exists, a reset link has been sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword({
    token: req.params.token,
    password: req.body.password,
  });

  return res.status(200).json(result);
});

const setPassword = asyncHandler(async (req, res) => {
  const result = await authService.setPasswordFromSetupToken({
    token: req.params.token,
    password: req.body.password,
  });

  return res.status(200).json(result);
});

const bootstrapAdmin = asyncHandler(async (req, res) => {
  const result = await authService.bootstrapAdmin(req.body);
  return res.status(201).json(result);
});

module.exports = {
  login,
  getMe,
  forgotPassword,
  resetPassword,
  setPassword,
  bootstrapAdmin,
};
