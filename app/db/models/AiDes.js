const mongoose = require("mongoose");

const aiDescriptionSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  description: { type: String, required: true },
  generated_at: { type: Date, default: Date.now },
});

export const AiDes =
  mongoose.models.AiDes || mongoose.model("AiDes", aiDescriptionSchema);
