const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  uploadId: mongoose.Schema.Types.ObjectId,
  startAt: String,
  endAt: String,
  durationMinutes: Number,
  appName: String,
  rawMeta: Object,
});

module.exports = mongoose.model("Activity", activitySchema);
