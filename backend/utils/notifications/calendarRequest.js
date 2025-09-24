import { getIO, getOnlineUsers } from "../../config/socket.js";

const sendRequest = (userId, request) => {
  const io = getIO();
  const onlineUsers = getOnlineUsers();

  if (!io) return console.error("Socket.io not initialized");

  const socketId = onlineUsers[userId];
  console.log("Socket id")
  console.log(socketId)
  if (socketId) {
    console.log("Emiting request...");
    io.to(socketId).emit("request", request);
    console.log(`Request: ${request}`);
    console.log("Emitted request!");
  } else {
    console.log(`User ${userId} is offline.`);
  }
};

export { sendRequest };
