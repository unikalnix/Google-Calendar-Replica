import mongoose, { Schema } from "mongoose";

const notificationsSchema = new Schema(
  {
    participants: [
      {
        email: { type: String },
        unread: { type: Boolean, default: false },
      },
    ],
    type: { type: String, enum: ["notify", "reminder"], default: "notify" },

    title: { type: String },
    message: { type: String },
    notifiedTime: { type: Date },

    color: { type: String, default: "#2463EB" }, // blue,
  },
  { timestamps: true }
);

const notificationsModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationsSchema);

export default notificationsModel;
