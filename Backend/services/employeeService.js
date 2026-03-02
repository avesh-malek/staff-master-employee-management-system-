const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const User = require("../models/User");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");
const AppError = require("../utils/appError");
const { getNextSequence } = require("./counterService");
const { generateRandomToken, hashToken } = require("../utils/token");
const { sendPasswordSetupEmail } = require("./notificationService");
const { deleteFileIfExists } = require("../utils/file");

const toEmployeeCode = (seq) => `EMP${String(seq).padStart(3, "0")}`;

const sanitizeEmployeeInput = (payload) => ({
  name: payload.name?.trim(),
  email: payload.email?.toLowerCase().trim(),
  phone: payload.phone?.trim(),
  department: payload.department?.trim(),
  designation: payload.designation?.trim(),
  employmentType: payload.employmentType,
  salary: payload.salary,
  joiningDate: payload.joiningDate,
  address: payload.address === undefined ? undefined : payload.address.trim(),
  role: payload.role === undefined ? undefined : payload.role,
  employmentStatus:
    payload.employmentStatus === undefined ? undefined : Boolean(payload.employmentStatus),
});

const getPublicEmployee = (employee) => ({
  _id: employee._id,
  employeeCode: employee.employeeCode,
  name: employee.name,
  email: employee.email,
  phone: employee.phone,
  department: employee.department,
  designation: employee.designation,
  employmentType: employee.employmentType,
  salary: employee.salary,
  joiningDate: employee.joiningDate,
  address: employee.address,
  profilePic: employee.profilePic,
  employmentStatus:
    employee.employmentStatus === undefined ? true : employee.employmentStatus,
  role: employee.user?.role || null,
  createdAt: employee.createdAt,
  updatedAt: employee.updatedAt,
});

const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid employee id", 400);
  }
};

const createEmployee = async ({ payload, actor }) => {
  const data = sanitizeEmployeeInput(payload);

  const existingEmployee = await Employee.findOne({ email: data.email });
  if (existingEmployee) {
    throw new AppError("Employee email already exists", 400);
  }

  const existingUser = await User.findOne({ email: data.email, deletedAt: null });
  if (existingUser) {
    throw new AppError("User email already exists", 400);
  }

  const seq = await getNextSequence("employee_code");
  const employeeCode = toEmployeeCode(seq);

  const rawSetupToken = generateRandomToken();
  const hashedSetupToken = hashToken(rawSetupToken);

  const temporaryPassword = await bcrypt.hash(generateRandomToken(), 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: temporaryPassword,
    role: data.role || "employee",
    employmentStatus: data.employmentStatus ?? true,
    passwordSetupToken: hashedSetupToken,
    passwordSetupExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  try {
    const employee = await Employee.create({
      employeeCode,
      user: user._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      designation: data.designation,
      employmentType: data.employmentType,
      salary: data.salary,
      joiningDate: data.joiningDate,
      address: data.address || "",
      employmentStatus: data.employmentStatus ?? true,
      createdBy: actor.id,
    });

    user.employee = employee._id;
    await user.save();

    await sendPasswordSetupEmail({
      email: user.email,
      setupToken: rawSetupToken,
      employeeCode,
    });

    return employee;
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
};

const listEmployees = async () => {
  const employees = await Employee.find()
    .populate("user", "role")
    .sort({ createdAt: -1 });
  return employees.map(getPublicEmployee);
};

const getEmployeeById = async (id, requester) => {
  assertObjectId(id);

  const employee = await Employee.findById(id).populate("user", "role");
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  const isAdminOrHr = ["admin", "hr"].includes(requester.role);
  const isSelf = requester.employeeId && requester.employeeId.toString() === employee._id.toString();

  if (!isAdminOrHr && !isSelf) {
    throw new AppError("Forbidden", 403);
  }

  return getPublicEmployee(employee);
};

const getMyEmployee = async (requester) => {
  if (!requester.employeeId) {
    throw new AppError("Employee profile not found", 404);
  }

  const employee = await Employee.findById(requester.employeeId).populate(
    "user",
    "role"
  );
  if (!employee) {
    throw new AppError("Employee profile not found", 404);
  }

  return getPublicEmployee(employee);
};

const updateEmployeeById = async ({ id, payload }) => {
  assertObjectId(id);

  const employee = await Employee.findById(id).populate("user", "role");
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  const allowedFields = [
    "name",
    "email",
    "phone",
    "department",
    "designation",
    "employmentType",
    "salary",
    "joiningDate",
    "address",
    "employmentStatus",
  ];

  const next = sanitizeEmployeeInput(payload);

  if (next.email && next.email !== employee.email) {
    const duplicateEmployee = await Employee.findOne({
      email: next.email,
      _id: { $ne: employee._id },
    });
    if (duplicateEmployee) {
      throw new AppError("Employee email already exists", 400);
    }

    const duplicateUser = await User.findOne({
      email: next.email,
      deletedAt: null,
      _id: { $ne: employee.user },
    });
    if (duplicateUser) {
      throw new AppError("User email already exists", 400);
    }
  }

  allowedFields.forEach((field) => {
    if (next[field] !== undefined) {
      employee[field] = next[field];
    }
  });

  await employee.save();

  if (employee.user) {
    const user = await User.findById(employee.user);

    if (user) {
      user.name = employee.name;
      user.email = employee.email;
      if (next.role) user.role = next.role;
      if (next.employmentStatus !== undefined) {
        if (user.employmentStatus !== next.employmentStatus) {
          user.tokenVersion += 1;
        }
        user.employmentStatus = next.employmentStatus;
      }
      await user.save();
      if (employee.user && typeof employee.user === "object") {
        employee.user.role = user.role;
      }
    }
  }

  return getPublicEmployee(employee);
};

const deleteEmployeeById = async (id) => {
  assertObjectId(id);

  const employee = await Employee.findById(id);
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  deleteFileIfExists(employee.profilePic);

  if (employee.user) {
    await User.findByIdAndDelete(employee.user);
  }

  await Leave.deleteMany({ employee: employee._id });
  await Attendance.deleteMany({ employee: employee._id });

  await employee.deleteOne();
};

const updateEmployeeProfilePicture = async ({ employeeId, filePath, requester, forceTarget }) => {
  const targetEmployeeId = forceTarget || employeeId;

  assertObjectId(targetEmployeeId);

  const employee = await Employee.findById(targetEmployeeId).populate(
    "user",
    "role"
  );
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  if (!forceTarget) {
    const isSelf = requester.employeeId && requester.employeeId.toString() === employee._id.toString();
    if (!isSelf) {
      throw new AppError("Forbidden", 403);
    }
  }

  if (employee.profilePic) {
    deleteFileIfExists(employee.profilePic);
  }

  employee.profilePic = filePath;
  await employee.save();

  return getPublicEmployee(employee);
};

module.exports = {
  createEmployee,
  listEmployees,
  getEmployeeById,
  getMyEmployee,
  updateEmployeeById,
  deleteEmployeeById,
  updateEmployeeProfilePicture,
};
