const mongoose = require("mongoose");
// --------------------------
const Food_Items_Schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    varients: [],
    prices: [],
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
// --------------------------
const Food_Items_Schema_Model = mongoose.model("pizzas", Food_Items_Schema);
// --------------------------
module.exports = Food_Items_Schema_Model;
// --------------------------
