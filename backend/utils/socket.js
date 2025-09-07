import { getIO, getOnlineUsers } from "../config/socket.js";

const sendNotificationToUser = (userId, message) => {
  const io = getIO();
  const onlineUsers = getOnlineUsers();

  if (!io) return console.error("Socket.io not initialized");

  const socketId = onlineUsers[userId];
  if (socketId) {
    io.to(socketId).emit("notification", message);
  } else {
    console.log(`User ${userId} is offline.`);
  }
};

const sendNotificationToUsers = (userIds, message) => {
  userIds.forEach((id) => sendNotificationToUser(id, message));
};

export { sendNotificationToUser, sendNotificationToUsers };
