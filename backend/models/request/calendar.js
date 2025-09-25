import mongoose, { Schema } from "mongoose";
import { requestCalendar } from "../../utils/default.js";
import User from "../user.js";

const requestCalendarSchema = new Schema(
  {
    requesterName: { type: String, trim: true },
    requesterEmail: { type: String, trim: true },

    recipientName: { type: String, trim: true },
    recipientEmail: { type: String, trim: true },

    requestType: {
      type: String,
      trim: true,
      default: requestCalendar.defaultType,
    },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: requestCalendar.status,
      default: requestCalendar.defaultStatus,
    },

    isRead: { type: Boolean, default: requestCalendar.defaultRead },
  },
  { timestamps: true }
);

const RequestCalendar =
  mongoose.models.RequestCalendar ||
  mongoose.model("RequestCalendar", requestCalendarSchema);

const requesCalendarHistorySchema = new Schema(
  {
    status: { type: String, enum: requestCalendar.status },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: User.modelName },
    requestBy: { type: mongoose.Schema.Types.ObjectId, ref: User.modelName },
    changedAt: { type: Date, default: Date.now },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: RequestCalendar.modelName,
      required: true,
    },
  },
  { timestamps: true }
);

const RequestCalendarHistory =
  mongoose.models.RequestCalendarHistory ||
  mongoose.model("RequestCalendarHistory", requesCalendarHistorySchema);

export { RequestCalendar, RequestCalendarHistory };