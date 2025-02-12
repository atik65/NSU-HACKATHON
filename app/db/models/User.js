const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  verified: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },
  profile_image: { type: String, default: null },
  isAdmin: { type: Boolean, default: true },
  bio: { type: String, default: null },
  crime_reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crime" }],
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
