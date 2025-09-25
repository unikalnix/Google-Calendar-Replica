import { Server } from "socket.io";

let io = null;
let onlineUsers = {};
export const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/gcrapp-socket"
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
<<<<<<< HEAD
      onlineUsers[userId] = socket.id; 
=======
      onlineUsers[userId] = socket.id;
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)
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
