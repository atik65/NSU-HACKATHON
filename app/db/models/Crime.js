const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: { type: String, required: false },
  division: { type: String, required: false },
  district: { type: String, required: false },
  crime_time: { type: Date, required: false },
  image: { type: String, required: false }, // URL of uploaded image
  video: { type: String, required: false }, // URL of uploaded video
  post_time: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  verification_score: { type: Number, default: 0 }, // AI verification score
  ai_response: {
    fake: { type: Number, default: 0 }, // AI-detected fake percentage
    real: { type: Number, default: 100 }, // AI-detected real percentage
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

export const Crime =
  mongoose.models.Crime || mongoose.model("Crime", crimeSchema);
