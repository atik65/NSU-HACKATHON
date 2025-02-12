const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  crime_id: {
    type: String,
    required: true,
  },
  comment: { type: String, required: true },
  proof_image: { type: String, default: null },
  proof_video: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
