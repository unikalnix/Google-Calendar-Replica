import mongoose, { Schema } from "mongoose";
import User from "./user.js";
import { notification } from "../utils/default.js";

const notificationsSchema = new Schema(
  {
    type: {
      type: String,
      enum: notification.types,
      default: notification.defaultType,
    },

    title: { type: String },
    message: { type: String },
    notifiedTime: { type: Date },

    color: { type: String, default: notification.defaultColor },
    user: {type: mongoose.Schema.Types.ObjectId, ref: User.modelName}
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationsSchema);

const notificationRecipientsSchema = Schema({
  email: { type: String },
  unread: { type: Boolean, default: false },
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Notification.modelName,
  },
});

const NotificationRecipients =
  mongoose.models.NotificationRecipients ||
  mongoose.model("NotificationRecipient", notificationRecipientsSchema);

export { Notification, NotificationRecipients };