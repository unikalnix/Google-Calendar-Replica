import mongoose, { Schema } from "mongoose";

const notificationsSchema = new Schema(
  {
    emails: [{ type: String }],
    type: { type: String, enum: ["notify", "reminder"], default: "notify" },

    title: { type: String },
    message: { type: String },
    notifiedTime: { type: Date },

    unread: { type: Boolean, default: false },
    color: { type: String, default: "#2463EB" }, // blue
  },
  { timestamps: true }
);

const notificationsModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationsSchema);

export default notificationsModel;
