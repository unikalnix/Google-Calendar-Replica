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

const sendNotificationToUsers = (
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
      message = `The calendar "${cal.name}" has been shared with you by ${ownerName}.`;
      break;
    case "updated":
      message = `The calendar "${cal.name}" has been updated by ${ownerName}.`;
      break;
    case "deleted":
      message = `The calendar "${cal.name}" has been deleted by ${ownerName}.`;
      break;
    default:
      message = `The calendar "${cal.name}" has an update from ${ownerName}.`;
  }

  createNotification(userIds, cal.color, message);
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
};

export { sendNotificationToUser, sendNotificationToUsers };
