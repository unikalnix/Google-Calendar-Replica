import express from "express";
import { getNotifications, setNotificationStatus } from "../controllers/notifications.js";
import userAuth from "../middlewares/userAuth.js";

const notificationsRouter = express.Router();

notificationsRouter.get("/readAll", userAuth, getNotifications); // get notifications for the specific user
notificationsRouter.get("/setStatus/:id", userAuth, setNotificationStatus); // get notifications for the specific user

export default notificationsRouter;
