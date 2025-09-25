import { getIO, getOnlineUsers } from "../../config/socket.js";

const sendCalendarAccessRequest = (recipientId, request) => {
  const io = getIO();
  let onlineUsers = getOnlineUsers();
  
  if (!io) return console.error("Socket.io not initialized");

  const socketId = onlineUsers[recipientId];
  if (socketId) {
    io.to(socketId).emit("request", request);
    console.log(`Request: ${request}`);
  } else {
    console.log(`User ${recipientId} is not online`);
  }
};

export { sendCalendarAccessRequest };
