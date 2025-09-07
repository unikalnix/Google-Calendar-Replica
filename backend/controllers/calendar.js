import calendarModel from "../models/calendar.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";
import { sendNotificationToUsers } from "../utils/socket.js";
import { deleteNotification } from "./notifications.js";

const create = async (req, res) => {
  const { name, color, isShared, sharedWith, autoRemove } =
    req.body;

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

    // If ->  isShared === true
    // then -> Send an email here to the users have their id's in the sharedWith array
    return res.json({
      success: true,
      message: "Calendar created successfully",
      calendar,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const readAllShared = async (req, res) => {
  try {
    const payload = req.user;
    const user = await userModel.findOne({ _id: payload.id });
    if (!user) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    const sharedWithMe = await calendarModel.find({
      "sharedWith.email": payload.email,
    });

    if (sharedWithMe.length === 0) {
      return res.json({
        success: false,
        message: "No shared calendars with you.",
      });
    }

    return res.json({
      success: true,
      message: "All shared calendars fetched successfully",
      length: sharedWithMe.length,
      sharedWithMe,
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

    return res.json({
      success: true,
      message: "All calendars fetched successfully",
      calendars,
      length: calendars.length,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.user;
    const cal = await calendarModel.findOneAndDelete({
      owner: new mongoose.Types.ObjectId(payload.id),
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!cal) {
      return res.json({
        success: false,
        message: "Calendar Not Found or may Already be deleted",
      });
    }

    if (cal.sharedWith && cal.sharedWith.length > 0) {
      const emails = cal.sharedWith.map((x) => x.email);
      const users = await userModel.find({ email: { $in: emails } }, "_id");
      const participantIds = users.map((u) => u._id.toString());
      const { name: owner } = await userModel.findOne({
        _id: new mongoose.Types.ObjectId(cal.owner),
      });
      sendNotificationToUsers(
        participantIds,
        `The calendar "${cal.name}" has been deleted by the owner (${owner}).`
      );

      // This is the notification function which creates a new document in database of notification for deleting a shared calendar
      deleteNotification(emails, cal.name, owner, cal.color);
    }

    return res.json({
      success: true,
      message: `${cal.name} Calendar deleted`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { create, readAll, deleteOne, readAllShared };
