const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  division: { type: String, required: true },
  district: { type: String, required: true },
  crime_time: { type: Date, required: true },
  image: { type: String }, // URL of uploaded image
  video: { type: String, default: null }, // URL of uploaded video
  post_time: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
