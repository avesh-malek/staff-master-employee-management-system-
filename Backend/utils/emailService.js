const nodemailer = require("nodemailer");

let etherealTransport = null;
let etherealAccount = null;

const initEthereal = async () => {
  if (!etherealAccount) {
    etherealAccount = await nodemailer.createTestAccount();
  }
};
// ================= TRANSPORT =================
const getTransport = async () => {
  const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();

  if (provider === "ethereal") {
    if (etherealTransport) return etherealTransport;

    await initEthereal();

    etherealTransport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
    });

    return etherealTransport;
  }

  throw new Error("Invalid EMAIL_PROVIDER. Only 'ethereal' supported.");
};

// ================= SEND EMAIL =================
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transport = await getTransport();

    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();

    if (provider === "ethereal") {
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
