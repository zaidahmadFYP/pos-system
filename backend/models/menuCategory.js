const mongoose = require("mongoose")

const menuCategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    columns: {
      type: Number,
      default: 2,
    },
    smallText: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("MenuCategory", menuCategorySchema)

