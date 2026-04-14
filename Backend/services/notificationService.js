const { sendEmail } = require("../utils/emailService");
const { baseTemplate } = require("../templates/emailTemplate");
const { enqueueEmail } = require("./emailQueue");

const sendPasswordSetupEmail = async ({ email, setupToken, employeeCode }) => {
  const appBase = process.env.APP_BASE_URL || "http://localhost:5173";
  const url = `${appBase}/#/set-password/${setupToken}`;
  enqueueEmail({
    to: email,
    subject: "Set your EMS password",
    text: `Welcome to EMS. Employee Code: ${employeeCode}. Set password here: ${url}`,
    html: baseTemplate(`
  <p>Welcome 👋</p>

  <p>Employee Code: <strong>${employeeCode}</strong></p>

  <p>
    <a href="${url}" style="background:#2c3e50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
      Set Password
    </a>
  </p>
`),
  });
};

const sendPasswordResetEmail = async ({ email, resetToken }) => {
  const appBase = process.env.APP_BASE_URL || "http://localhost:5173";

  const url = `${appBase}/#/reset-password/${resetToken}`;

  enqueueEmail({
    to: email,
    subject: "EMS password reset",
    text: `Reset your password here: ${url}`,
    html: baseTemplate(`
  <p>Reset your EMS password</p>

  <p>
    <a href="${url}" style="background:#e74c3c;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
      Reset Password
    </a>
  </p>
`),
  });
};

const sendLeaveStatusEmail = async ({ email, status, fromDate, toDate }) => {
  enqueueEmail({
    to: email,
    subject: `Leave request ${status}`,
    text: `Your leave request (${fromDate} to ${toDate}) was ${status}.`,
    html: baseTemplate(`
  <h3>Leave Request ${status.toUpperCase()}</h3>

  <p>
    From <strong>${fromDate}</strong> to <strong>${toDate}</strong>
  </p>

  <p>
    Status:
    <strong style="color:${status === "approved" ? "green" : "red"};">
      ${status}
    </strong>
  </p>
`),
  });
};

const sendAnnouncementEmail = async ({ recipients, title, message }) => {
  const batchSize = 10;
  const delayBetweenBatches = 3000;

  const uniqueRecipients = [
    ...new Set(recipients.filter((email) => email && email.includes("@"))),
  ];

  for (let i = 0; i < uniqueRecipients.length; i += batchSize) {
    const batch = uniqueRecipients.slice(i, i + batchSize);

    console.log(`📦 Sending batch ${i / batchSize + 1}`);

    for (const email of batch) {
      enqueueEmail({
        to: email,
        subject: `EMS Announcement: ${title}`,
        text: message,
        html: baseTemplate(`
  <h3>${title}</h3>
  <p>${message}</p>
`),
      });
    }

    await new Promise((res) => setTimeout(res, delayBetweenBatches));
  }
};

module.exports = {
  sendPasswordSetupEmail,
  sendPasswordResetEmail,
  sendLeaveStatusEmail,
  sendAnnouncementEmail,
};
