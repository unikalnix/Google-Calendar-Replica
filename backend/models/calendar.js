import mongoose from "mongoose";
import { calendar } from "../utils/default.js";
import User from "../models/user.js";

const CalendarSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      default: calendar.color,
    },

    isShared: {
      type: Boolean,
      default: calendar.isShared,
    },
    
    autoRemove: {
      type: Boolean,
      default: calendar.autoRemove,
    },
    isDefault:{type:Boolean, default:calendar.isDefault},
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
  },
  { timestamps: true }
);

const Calendar =
  mongoose.models.Calendar || mongoose.model("Calendar", CalendarSchema);

const calendarParticipantsSchema = new mongoose.Schema({
  email: { type: String },
  role: {
    type: String,
    enum: calendar.roles,
    default: calendar.defaultRole,
  },
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Calendar.modelName,
  },
});

const CalendarParticipants =
  mongoose.models.CalendarParticipants ||
  mongoose.model("CalendarParticipant", calendarParticipantsSchema);

export { Calendar, CalendarParticipants };