import {
  Notification,
  NotificationRecipients,
} from "../models/notifications.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const createNotification = async (userIds, cal, message) => {
  const ids = Array.isArray(userIds) ? userIds : [userIds];
  const users = await User.find(
    { _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) } },
    "email"
  );

  if (!users.length) {
    return { success: false, message: "No users found" };
  }

  const notification = await Notification.create({
    type: "notify",
    title: "Calendar Update",
    message,
    notifiedTime: new Date(),
    color: cal?.color,
  });

  const recipientDocs = users.map((u) => ({
    email: u.email,
    unread: true,
    notificationId: notification._id,
  }));
  await NotificationRecipients.insertMany(recipientDocs);
  return { success: true, notification, recipients: recipientDocs };
};

const getNotifications = async (req, res) => {
  try {
    const payload = req.payload;
    const notifications = await NotificationRecipients.find({
      email: payload.email,
    }).populate("notificationId");

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
    const id = req.params?.id;
    const participant = await NotificationRecipients.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!participant) {
      return res.json({
        success: false,
        message: "You are not a participant of this notification",
      });
    }

    participant.unread = false;
    await participant.save();

    return res.json({ success: true, message: "Read status updated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { createNotification, getNotifications, setNotificationStatus };