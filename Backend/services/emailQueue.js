const { sendEmail } = require("../utils/emailService");

const queue = [];
let isProcessing = false;

const processQueue = async () => {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }
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

const enqueueEmail = async (emailData) => {
  process.nextTick(async () => {
    try {
      await sendEmail(emailData);
    } catch (err) {
      console.error("Email failed:", err);
    }
  });
};

module.exports = { enqueueEmail };
