const nodemailer = require("nodemailer");

const getTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transport = getTransport();

    if (!transport) {
      return false;
    }

    await transport.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
  if (error.responseCode === 550) {
    console.warn("⚠️ Email rate limit reached (Mailtrap)");
  } else {
    console.error("Email error:", error.message);
  }
  return false;
}
};

module.exports = { sendEmail };
