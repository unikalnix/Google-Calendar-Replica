import calendarModel from "../models/calendar.js";
import userModel from "../models/user.js";

const create = async (req, res) => {
  const { name, color, isShared, sharedWith, autoRemove } =
    req.body?.calendarData;
  const payload = req.user;
  if (!name) {
    return res.json({ success: false, message: "Name is required" });
  }

  try {
    const calendar = await calendarModel.create({
      name,
      color,
      isShared,
      sharedWith,
      autoRemove,
      owner: payload.id,
    });

    const user = await userModel.findOne({ _id: payload.id });
    if (!user) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    user.calendars.push(calendar._id);
    await user.save();
    return res.json({
      success: true,
      message: "Calendar created successfully",
      calendar,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const readAll = async (req, res) => {
  try {
    const payload = req.user;
    const user = await userModel.findOne({ _id: payload.id });
    if (!user) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    const calendars = await calendarModel
      .find({ _id: { $in: user.calendars } })
      .select("-owner -autoRemove");

    if (calendars.length === 0) {
      return res.json({ success: false, message: "No calendars found" });
    }

    const sharedWithMe = await calendarModel.find({
      "sharedWith.email": payload.email,
    });

    return res.json({
      success: true,
      message: "All calendars fetched successfully",
      calendars,
      length: calendars.length,
      sharedWithMe: sharedWithMe.length === 0
        ? "No shared calendars with you"
        : sharedWithMe,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { create, readAll };
