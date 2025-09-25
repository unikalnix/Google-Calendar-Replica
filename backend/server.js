import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userAuth from "./middlewares/userAuth.js";
import userRouter from "./routes/user.js";
import notificationsRouter from "./routes/notifications.js";
import calendarRouter from "./routes/calendar.js";
import eventRouter from "./routes/event.js";
import { initSocket } from "./config/socket.js";
import http from "http";

export const app = express();
export const allowedOrigins = [
  "http://localhost:5173",
  "https://joyful-llama-8e2e6c.netlify.app",
];
const port = process.env.PORT || 3000;
<<<<<<< HEAD

connectDB();
=======
 
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log("DB connection failed!⚠️");
    process.exit(1);
  }
})();
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
// app.use(limiter);

// Endpoints
app.get("/", (_, res) => {
  res.send("API WORKING");
});

app.get("/check-auth", userAuth, (req, res) => {
  const payload = req.payload;
  return res.json({
    success: true,
    message: "User Authenticated",
    userId: payload.id,
<<<<<<< HEAD
    userEmail: payload.email
=======
    userEmail: payload.email,
    userName: payload.name
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)
  });
});

app.use("/api/user", userRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/event", eventRouter);
app.use("/api/notification", notificationsRouter);

const server = http.createServer(app);
initSocket(server, allowedOrigins);
server.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
