const mongoose = require("mongoose");

const adminActionSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: String, enum: ["ban_user"], required: true },
  target_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action_taken_at: { type: Date, default: Date.now },
});

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminActionSchema);
