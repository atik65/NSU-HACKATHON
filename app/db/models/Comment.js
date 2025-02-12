const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  crime_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crime",
    required: true,
  },
  comment: { type: String, required: true },
  proof_image: { type: String, default: null },
  proof_video: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
