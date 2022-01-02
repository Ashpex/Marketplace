const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Session = new Schema(
  {
    idUser: { type: String, maxlength: 255 },
    idShoppingCart: { type: Schema.Types.ObjectId },
  },
  { collection: "session" }
);

module.exports = mongoose.model("Session", Session);
