const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rating = new Schema(
  {
    emailUser: { type: Schema.Types.String },
    rating: { type: Schema.Types.Number },
    content: { type: String, maxLength: 255 },
  },
  { collection: "rating" }
);

module.exports = mongoose.model("Rating", Rating);
