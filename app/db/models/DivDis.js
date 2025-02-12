const mongoose = require("mongoose");

const divisionDistrictSchema = new mongoose.Schema({
  division_name: { type: String, required: true },
  districts: [{ type: String, required: true }],
});

export const DivDis =
  mongoose.models.DivDis || mongoose.model("DivDis", divisionDistrictSchema);
