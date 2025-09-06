import express from "express";
import "dotenv/config";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userAuth from "./middlewares/userAuth.js";
import userRouter from "./routes/user.js";
import calendarRouter from "./routes/calendar.js";
import eventRouter from "./routes/event.js";

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Endpoints
app.get("/", (_, res) => {
  res.send("API WORKING");
});

app.get("/check-auth", userAuth, (req, res) => {
  console.log(req.user);
  return res.json({ success: true, message: "User Authenticated" });
});

app.use("/api/user", userRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/event", eventRouter);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
