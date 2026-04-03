const { sendEmail } = require("../utils/emailService");
const { enqueueEmail } = require("./emailQueue");

const sendPasswordSetupEmail = async ({ email, setupToken, employeeCode }) => {
  const appBase = process.env.APP_BASE_URL || "http://localhost:5173";
  const url = `${appBase}/set-password/${setupToken}`;

  enqueueEmail({
    to: email,
    subject: "Set your EMS password",
    text: `Welcome to EMS. Employee Code: ${employeeCode}. Set password here: ${url}`,
    html: `<p>Welcome to EMS.</p><p>Employee Code: <strong>${employeeCode}</strong></p><p><a href="${url}">Set Password</a></p>`,
  });
};

const sendPasswordResetEmail = async ({ email, resetToken }) => {
  const appBase = process.env.APP_BASE_URL || "http://localhost:5173";
  const url = `${appBase}/reset-password/${resetToken}`;

  enqueueEmail({
    to: email,
    subject: "EMS password reset",
    text: `Reset your password here: ${url}`,
    html: `<p><a href="${url}">Reset Password</a></p>`,
  });
};

const sendLeaveStatusEmail = async ({ email, status, fromDate, toDate }) => {
  enqueueEmail({
    to: email,
    subject: `Leave request ${status}`,
    text: `Your leave request (${fromDate} to ${toDate}) was ${status}.`,
    html: `<p>Your leave request (<strong>${fromDate}</strong> to <strong>${toDate}</strong>) was <strong>${status}</strong>.</p>`,
  });
};

const sendAnnouncementEmail = async ({ recipients, title, message }) => {
  recipients.forEach((email) => {
    enqueueEmail({
      to: email,
      subject: `EMS Announcement: ${title}`,
      text: message,
      html: `<p>${message}</p>`,
    });
  });
};

module.exports = {
  sendPasswordSetupEmail,
  sendPasswordResetEmail,
  sendLeaveStatusEmail,
  sendAnnouncementEmail,
};
