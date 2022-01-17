const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationSchema = new Schema(
    {
        title: { type: Schema.Types.String },
        content: { type: Schema.Types.String },
        time: { type: Schema.Types.Date },
        seen: { type: Schema.Types.Boolean, default: false },
    },
    {
        collection: "notification",
    }
);
const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
