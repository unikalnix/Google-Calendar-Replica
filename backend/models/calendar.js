import mongoose from "mongoose";

const CalendarSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#155DFC", // blue
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        email: { type: String },
        role: {
          type: String,
          enum: ["viewer", "editor", "owner"],
          default: "viewer",
        },
      },
    ],
    autoRemove: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

const calendarModel =
  mongoose.models.calendarModel || mongoose.model("Calendar", CalendarSchema);

export default calendarModel;
