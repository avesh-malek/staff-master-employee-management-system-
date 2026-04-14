const axios = require("axios");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "EMS",
          email: process.env.EMAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html || text,
        
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent to:", to);
    return true;
  } catch (error) {
    console.error(
      "❌ Email error:",
      error.response?.data || error.message
    );
    return false;
  }
};

module.exports = { sendEmail };