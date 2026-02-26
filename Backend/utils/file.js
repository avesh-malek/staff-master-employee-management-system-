const path = require("path");
const fs = require("fs");

const deleteFileIfExists = (relativeFilePath) => {
  if (!relativeFilePath) return;

  const cleanPath = relativeFilePath.startsWith("/")
    ? relativeFilePath.slice(1)
    : relativeFilePath;

  const fullPath = path.join(__dirname, "..", cleanPath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = {
  deleteFileIfExists,
};
