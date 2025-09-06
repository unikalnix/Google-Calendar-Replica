import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
    },
    location: { type: String, trim: true },
    participants: [{ type: String }],
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none",
    },
    reminderMinutes: {
      type: Number,
      enum: [10, 30, 60],
      default: 10,
    },
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Calendar",
      required: true,
    },
  },
  { timestamps: true }
);

const eventModel =
  mongoose.models.Event || mongoose.model("Event", eventSchema);

export default eventModel;
