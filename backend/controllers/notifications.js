import notificationsModel from "../models/notifications.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";

// This is the notification function which creates a new document in database of notification for deleting a shared calendar
const deleteNotification = async (emails, calName, ownerName, calColor) => {
  const notification = await notificationsModel.create({
    emails,
    type: "notify",
    title: "Calendar Update",
    message: `The calendar "${calName}" has been deleted by the owner (${ownerName}).`,
    notifiedTime: new Date(),
    unread: false,
    color: calColor,
  });

  return notification;
};

const getNotifications = async (req, res) => {
  try {
    const payload = req.user;
    const notifications = await notificationsModel.find({
      emails: payload.email,
    });

    if (!notifications) {
      return res.json({
        success: false,
        message: "No new Notification",
      });
    }
    return res.json({
      success: true,
      message: "All notifications fetched successfully",
      length: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const setNotificationStatus = async (req, res) => {
  try {
    const id = req.params;
    const payload = req.user;

    const user = await userModel.findOne({
      _id: payload.id,
      email: payload.email,
    });
    if (!user) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    const notificationDocument = await notificationsModel.findById(new mongoose.Types.ObjectId(id));
    if (!notificationDocument) {
      res.json({ success: false, message: "Notification is not found" });
    }

    notificationDocument.unread = false;
    await notificationDocument.save();

    return res.json({ success: true, message: "Read status updated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { deleteNotification, getNotifications, setNotificationStatus };
