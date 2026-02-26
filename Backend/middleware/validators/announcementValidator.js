const { body, param } = require("express-validator");

const createAnnouncementValidation = [
  body("title").trim().notEmpty().isLength({ max: 120 }),
  body("message").trim().notEmpty().isLength({ max: 1000 }),
];

const announcementIdParamValidation = [param("id").isMongoId()];

module.exports = {
  createAnnouncementValidation,
  announcementIdParamValidation,
};
