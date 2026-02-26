const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signAccessToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const verifyAccessToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateRandomToken = () => crypto.randomBytes(32).toString("hex");
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateRandomToken,
  hashToken,
};
