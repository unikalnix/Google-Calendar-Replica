import express from "express";
import userAuth from "../middlewares/userAuth.js";
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
  createEvent
);
eventRouter.get("/getEvents", userAuth, getEvents);
eventRouter.get(
  "/getEvent/:calendarId/:eventId",
  userAuth,
  getEvent
);
eventRouter.delete(
  "/deleteEvent/:calendarId/:eventId",
  userAuth,
  deleteEvent
);
eventRouter.patch(
  "/update/:eventId",
  userAuth,
  updateEvent
);

export default eventRouter;