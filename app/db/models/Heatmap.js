const mongoose = require("mongoose");

const heatmapSchema = new mongoose.Schema({
  location: { type: String, required: true },
  count: { type: Number, required: true },
  date_range: { type: String, required: true },
});

export const Heatmap =
  mongoose.models.Heatmap || mongoose.model("Heatmap", heatmapSchema);
