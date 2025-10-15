import express from "express";
import reminderWorker from "../workers/reminder.js";

const reminderRouter = express.Router();
reminderRouter.use("/", reminderWorker);

export default reminderRouter;
