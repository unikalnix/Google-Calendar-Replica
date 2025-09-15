import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { attachCalendar } from "../middlewares/attachCalendar.js";
import { attachUser } from "../middlewares/attachUser.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import {
  createEvent,
  getEvents,
  getEvent,
  deleteEvent,
  updateEvent,
} from "../controllers/event.js";

const eventRouter = express.Router();

eventRouter.post(
  "/create",
  userAuth,
  attachUser,
  attachCalendar,
  roleAuth("createEvent"),
  createEvent
);
eventRouter.get("/getEvents", userAuth, attachUser, getEvents);
eventRouter.get(
  "/getEvent/:calendarId/:eventId",
  userAuth,
  attachUser,
  attachCalendar,
  getEvent
);
eventRouter.delete(
  "/deleteEvent/:calendarId/:eventId",
  userAuth,
  attachUser,
  attachCalendar,
  roleAuth("deleteEvent"),
  deleteEvent
);
eventRouter.patch(
  "/update/:eventId",
  userAuth,
  attachUser,
  attachCalendar,
  roleAuth("updateEvent"),
  updateEvent
);

export default eventRouter;
