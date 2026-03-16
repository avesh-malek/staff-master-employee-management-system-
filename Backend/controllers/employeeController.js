const asyncHandler = require("../middleware/asyncHandler");
const employeeService = require("../services/employeeService");
const AppError = require("../utils/appError");

const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee({
    payload: req.body,
    actor: req.user,
  });

  return res.status(201).json(employee);
});

const getEmployees = asyncHandler(async (req, res) => {
  const result = await employeeService.listEmployees(req.query);

  return res.status(200).json(result);
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(
    req.params.id,
    req.user,
  );
  return res.status(200).json(employee);
});

const getMyEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getMyEmployee(req.user);
  return res.status(200).json(employee);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployeeById({
    id: req.params.id,
    payload: req.body,
  });

  return res.status(200).json(employee);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployeeById(req.params.id);
  return res.status(200).json({ message: "Employee deleted successfully" });
});

const updateMyProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Invalid or missing input data", 400);
  }

  const profilePic = `/uploads/profile/${req.file.filename}`;

  const employee = await employeeService.updateEmployeeProfilePicture({
    employeeId: req.user.employeeId,
    filePath: profilePic,
    requester: req.user,
  });

  return res.status(200).json(employee);
});

const updateEmployeeProfilePictureById = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Invalid or missing input data", 400);
  }

  const profilePic = `/uploads/profile/${req.file.filename}`;

  const employee = await employeeService.updateEmployeeProfilePicture({
    filePath: profilePic,
    requester: req.user,
    forceTarget: req.params.id,
  });

  return res.status(200).json(employee);
});

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyEmployee,
  updateEmployee,
  deleteEmployee,
  updateMyProfilePicture,
  updateEmployeeProfilePictureById,
};
