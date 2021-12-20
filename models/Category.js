const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: { type: String, maxlength: 255 },
    listIdProduct: [{ type: Schema.Types.ObjectId }],
    image: String,
    idCategory: { type: String, maxlength: 255 },
  },
  { collection: "category" }
);

module.exports = mongoose.model("Category", Category);
