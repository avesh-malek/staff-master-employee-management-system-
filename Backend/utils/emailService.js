const nodemailer = require("nodemailer");

let etherealTransport = null;

// ================= TRANSPORT =================
const getTransport = async () => {
  const provider = process.env.EMAIL_PROVIDER;

  // ===== ETHEREAL (for development) =====
  if (provider === "ethereal") {
    if (etherealTransport) return etherealTransport;

    const testAccount = await nodemailer.createTestAccount();

    etherealTransport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("🟡 Using ETHEREAL");
    console.log("User:", testAccount.user);
    console.log("Pass:", testAccount.pass);

    return etherealTransport;
  }

  // ===== DEFAULT (Mailtrap / SMTP) =====
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("⚠️ SMTP not configured");
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

// ================= SEND EMAIL =================
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transport = await getTransport();

    if (!transport) return false;

    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    // 👉 Show preview only for Ethereal
    if (process.env.EMAIL_PROVIDER === "ethereal") {
      const preview = nodemailer.getTestMessageUrl(info);
      console.log("📧 Preview Email:", preview);
    }

    return true;
  } catch (error) {
    if (error.responseCode === 550) {
      console.warn("⚠️ Email rate limit reached");
    } else {
      console.error("Email error:", error.message);
    }
    return false;
  }
};

module.exports = { sendEmail };