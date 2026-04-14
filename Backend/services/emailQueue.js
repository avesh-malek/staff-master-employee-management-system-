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

    await new Promise((res) => setTimeout(res, 1000));
  }

  isProcessing = false;
};

// 🔥 IMPORTANT FIX
const enqueueEmail = (emailData) => {
  queue.push(emailData);

  // ALWAYS trigger processing safely
  if (!isProcessing) {
    processQueue();
  }
};

module.exports = { enqueueEmail };