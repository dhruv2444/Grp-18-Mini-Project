const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadId: mongoose.Schema.Types.ObjectId,
  analysisDate: Date,
  rawModelResponse: Object,
});

module.exports = mongoose.model("Analysis", analysisSchema);
