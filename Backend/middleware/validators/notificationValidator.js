const { param } = require("express-validator");

const notificationIdParamValidation = [param("id").isMongoId()];

module.exports = {
  notificationIdParamValidation,
};
