const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: { type: String, maxlength: 255 },
    password: { type: String, maxlength: 255 },
    name: { type: String, maxlength: 255 },
    address: { type: String, maxlength: 255 },
    idShoppingCart: { type: Schema.Types.ObjectId },
    listIdShoppingCartHistory: [{ type: Schema.Types.ObjectId }],
    status: Boolean,
  },
  { collection: "user" }
);

module.exports = mongoose.model("User", User);
