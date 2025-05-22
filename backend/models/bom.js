const mongoose = require("mongoose");

const bomSchema = new mongoose.Schema({
  RawID: { type: Number, required: true },
  Name: { type: String, required: true },
  UnitMeasure: { type: String, required: true },
  Quantity: { type: Number, required: true },
});

const BOM = mongoose.model("Bom", bomSchema);

module.exports = BOM;
