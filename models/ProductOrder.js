const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductOrder = new Schema(
  {
    idProduct: { type: Schema.Types.String },
    quantity: { type: Schema.Types.Number },
  },
  { collection: "product-order" }
);

module.exports = mongoose.model("ProductOrder", ProductOrder);
