import mongoose from "mongoose";
const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  uploadedAt: Date,
});
export default mongoose.model("Upload", uploadSchema);
