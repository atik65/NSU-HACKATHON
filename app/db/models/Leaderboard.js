const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  type: {
    type: String,
    enum: ["top_contributors", "most_helpful_comments"],
    required: true,
  },
});

export const Leaderboard =
  mongoose.models.Leaderboard ||
  mongoose.model("Leaderboard", leaderboardSchema);
