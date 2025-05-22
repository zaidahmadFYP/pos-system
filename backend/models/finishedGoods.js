const mongoose = require("mongoose");

const finishedGoodsSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuCategory"
  },
  rawIngredients: [
    {
      RawID: { type: Number, required: true },
      Name: { type: String, required: true },
      RawConsume: { type: Number, required: true },
      UnitMeasure: { type: String, required: true },
    },
  ],
});

const FinishedGoods = mongoose.model("FinishedGoods", finishedGoodsSchema);

module.exports = FinishedGoods;