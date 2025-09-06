import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    calendars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }],
  },
  { timestamps: true }
);

const userModel = mongoose.models.userModel || mongoose.model("User", userSchema);

export default userModel;
