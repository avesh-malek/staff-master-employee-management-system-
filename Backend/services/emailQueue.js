const { sendEmail } = require("../utils/emailService");

const queue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const job = queue.shift();

    try {
      await sendEmail(job);
    } catch (err) {
      console.error("Email failed:", err.message);
    }

    // ⏱ delay (avoid rate limit)
    await new Promise((res) => setTimeout(res, 2000));
  }

  isProcessing = false;
};

const enqueueEmail = (emailData) => {
  queue.push(emailData);
  processQueue(); // trigger worker
};

module.exports = { enqueueEmail };