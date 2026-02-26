const Counter = require("../models/Counter");

const getNextSequence = async (key) => {
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
};

module.exports = {
  getNextSequence,
};
