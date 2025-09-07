import { Server } from "socket.io";

let io;
let onlineUsers = {};

export const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      onlineUsers[userId] = socket.id; 
      console.log("Online users:", onlineUsers);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
        }
      }
    });
  });
};

export const getIO = () => io;
export const getOnlineUsers = () => onlineUsers;
