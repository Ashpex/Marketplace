const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Producer = new Schema(
  {
    name: String,
    listIdProduct: [{ type: Schema.Types.ObjectId }],
  },
  { collection: "producer" }
);

module.exports = mongoose.model("Producer", Producer);
