const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email_or_phone: { type: String, required: true },
  otp: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

export const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
