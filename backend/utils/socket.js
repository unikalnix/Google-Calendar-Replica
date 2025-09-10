import { getIO, getOnlineUsers } from "../config/socket.js";
import mongoose from "mongoose";
import { createNotification } from "../controllers/notifications.js";

const sendNotificationToUser = (userId, notification) => {
  const io = getIO();
  const onlineUsers = getOnlineUsers();

  if (!io) return console.error("Socket.io not initialized");

  const socketId = onlineUsers[userId];
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  } else {
    console.log(`User ${userId} is offline.`);
  }
};

const sendNotificationToUsers = async (
  userIds,
  cal,
  ownerName,
  action = "created"
) => {
  let message = "";
  switch (action) {
    case "created":
      message = `The calendar "${cal.name}" has been created by ${ownerName}.`;
      break;
    case "shared":
      message = `The calendar "${cal.name}" has been shared with you by ${ownerName}`;
      break;
    case "updated":
      message = `The calendar "${cal.name}" has been updated by ${ownerName}.`;
      break;
    case "deleted":
      message = `The calendar "${cal.name}" has been deleted by ${ownerName}.`;
      break;
    case "removed":
      message = `${ownerName} removed you from ${cal.name}.`;
      break;
    default:
      message = `The calendar "${cal.name}" has an update from ${ownerName}.`;
  }

  if (!Array.isArray(userIds)) {
    let res = await createNotification(userIds, cal, message);
    if (!res.success) return res;
    sendNotificationToUser(userIds.toString(), {
      _id: new mongoose.Types.ObjectId(),
      type: "notify",
      title: "Calendar Update",
      message,
      unread: true,
      color: cal.color,
      notifiedTime: new Date(),
    });
  } else {
    createNotification(userIds, cal, message);
    userIds.forEach((id) => {
      sendNotificationToUser(id, {
        _id: new mongoose.Types.ObjectId(),
        type: "notify",
        title: "Calendar Update",
        message,
        unread: true,
        color: cal.color,
        notifiedTime: new Date(),
      });
    });
  }

  return { success: true };
};

export { sendNotificationToUser, sendNotificationToUsers };
