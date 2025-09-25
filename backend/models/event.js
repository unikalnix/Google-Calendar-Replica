import mongoose, { Schema } from "mongoose";
import { event } from "../utils/default.js";
import { Calendar } from "../models/calendar.js";
import User from "../models/user.js";

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    location: { type: String, trim: true },
    repeat: {
      type: String,
      enum: event.repeat,
      default: event.defaultRepeat,
    },
    reminderMinutes: {
      type: Number,
      enum: event.reminderMinutes,
      default: event.defaultReminderMinutes,
    },
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Calendar.modelName,
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: User.modelName },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

const eventParticipantsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: Event.modelName },
  },
  { timestamps: true }
);

const EventParticipants =
  mongoose.models.EventParticipants ||
  mongoose.model("EventParticipant", eventParticipantsSchema);

export { Event, EventParticipants };