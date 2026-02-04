import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

/**
 * @route   POST /api/employees
 * @desc    Create employee
 */
router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /api/employees
 * @desc    Get all employees
 */
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

/**
 * @route   GET /api/employees/:id
 * @desc    Get single employee by employeeId
 */
router.get("/:id", async (req, res) => {
  const employee = await Employee.findOne({
    employeeId: req.params.id,
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(employee);
});

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 */
router.put("/:id", async (req, res) => {
  const employee = await Employee.findOneAndUpdate(
    { employeeId: req.params.id },
    req.body,
    { new: true }
  );

  res.json(employee);
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee
 */
router.delete("/:id", async (req, res) => {
  await Employee.findOneAndDelete({
    employeeId: req.params.id,
  });

  res.json({ message: "Employee deleted" });
});

export default router;
