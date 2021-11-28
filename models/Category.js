const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: { type: String, maxlength: 255 },
    listIdProduct: [],
    idCategory: { type: String, maxlength: 255 },
  },
  { collection: "category" }
);

module.exports = mongoose.model("Category", Category);
