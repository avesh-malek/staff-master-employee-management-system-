const express = require("express");

const {
  generatePayroll,
  getPayroll,
  getMyPayroll,
  payPayroll,
  downloadPayslip,
  bulkDownloadPayslips,
} = require("../controllers/payrollController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { handleValidationErrors } = require("../middleware/validationMiddleware");

const {
  payrollGenerateValidation,
  payrollListValidation,
  payrollMyListValidation,
  payrollPayValidation,
  payrollIdValidation,
  payrollBulkValidation,
} = require("../middleware/validators/payrollValidator");

const router = express.Router();

router.post(
  "/generate",
  protect,
  authorizeRoles("admin"),
  payrollGenerateValidation,
  handleValidationErrors,
  generatePayroll
);

router.get(
  "/my",
  protect,
  payrollMyListValidation,
  handleValidationErrors,
  getMyPayroll
);

router.post(
  "/payslips",
  protect,
  authorizeRoles("admin"),
  payrollBulkValidation,
  handleValidationErrors,
  bulkDownloadPayslips
);

router.get(
  "/:id/payslip",
  protect,
  payrollIdValidation,
  handleValidationErrors,
  downloadPayslip
);

router.patch(
  "/:id/pay",
  protect,
  authorizeRoles("admin"),
  payrollPayValidation,
  handleValidationErrors,
  payPayroll
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  payrollListValidation,
  handleValidationErrors,
  getPayroll
);

module.exports = router;