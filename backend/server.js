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
import requestRouter from "./routes/request.js";

export const app = express();
export const allowedOrigins = [
  process.env.PROD_CLIENT_URL,
  process.env.VITE_CLIENT_URL,
];
const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log("DB connection failed!⚠️");
    process.exit(1);
  }
})();

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
    userEmail: payload.email,
    userName: payload.name,
  });
});

app.use("/api/user", userRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/event", eventRouter);
app.use("/api/notification", notificationsRouter);
app.use("/api/request", requestRouter);
app.use((_, res, __) => {
  res.json({ success: false, message: "Something went wrong" });
});
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const server = http.createServer(app);
initSocket(server, allowedOrigins);
server.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
