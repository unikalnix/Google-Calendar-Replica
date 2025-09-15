import notificationsModel from "../models/notifications.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";

const createNotification = async (userIds, cal, message) => {
  if (!Array.isArray(userIds)) {
    const user = await userModel.findOne({_id:userIds});

    if (!user) {
      return { success: false, message: "User not found" };
    }
    const participant = { email: user.email, unread: true };

    const notification = await notificationsModel.create({
      participants: participant,
      type: "notify",
      title: "Calendar Update",
      message,
      notifiedTime: new Date(),
    });

    let n = notification.toObject();
    n["success"] = true;
    console.log(n)
    return n;
  } else {
    const users = await userModel.find(
      { _id: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) } },
      "email"
    );
    const participants = users.map((u) => ({
      email: u.email,
      unread: true,
    }));

    const notification = await notificationsModel.create({
      participants,
      type: "notify",
      title: "Calendar Update",
      message,
      notifiedTime: new Date(),
      color: cal.color,
    });
    
    
    let n = notification.toObject();
    n["success"] = true;
    return n;
  }
};

const getNotifications = async (req, res) => {
  try {
    const payload = req.payload;
    const notifications = await notificationsModel.find({
      "participants.email": payload.email,
    });

    if (!notifications) {
      return res.json({
        success: false,
        message: "No new Notification",
      });
    }

    const finalNotificationsArray = notifications
      .map((n) => {
        const participant = n.participants.find(
          (p) => p.email === payload.email
        );
        if (!participant) return null; // so the filter removes it - that's a falsy value
        return {
          _id: n._id,
          email: participant.email,
          unread: participant.unread,
          type: n.type,
          title: n.title,
          message: n.message,
          notifiedTime: n.notifiedTime,
          color: n.color,
        };
      })
      .filter(Boolean); // removes falsy valyes from mapped array

    return res.json({
      success: true,
      message: "All notifications fetched successfully",
      length: notifications.length,
      notifications: finalNotificationsArray,
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
    const payload = req.payload;

    const notificationDocument = await notificationsModel.findById(
      new mongoose.Types.ObjectId(id)
    );

    if (!notificationDocument) {
      res.json({ success: false, message: "Notification is not found" });
    }

    const participant = notificationDocument.participants.find(
      (p) => p.email === payload.email
    );

    if (!participant) {
      return res.json({
        success: false,
        message: "You are not a participant of this notification",
      });
    }

    participant.unread = false;
    await notificationDocument.save();

    return res.json({ success: true, message: "Read status updated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { createNotification, getNotifications, setNotificationStatus };
