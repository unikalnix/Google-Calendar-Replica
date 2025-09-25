import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  create,
  getMyCalendars,
  readAllShared,
  deleteOne,
  shareCalendar,
  updateRole,
  removeParticipant,
  getParticipants,
  getCalendar,
  getSharedCalendar
} from "../controllers/calendar.js";

const calendarRouter = express.Router();

calendarRouter.post("/create", userAuth, create);
calendarRouter.get("/readAllShared", userAuth, readAllShared); // Read all calendars shared with me by others
calendarRouter.get("/getMyCalendars", userAuth, getMyCalendars);
calendarRouter.put("/updateRole", userAuth, updateRole);

calendarRouter.post(
  "/deleteOne/:calendarId",
  userAuth,
  deleteOne
);

calendarRouter.post(
  "/share/:calendarId",
  userAuth,
  shareCalendar
);


calendarRouter.delete(
  "/deleteParticipant/:calendarId",
  userAuth,
  removeParticipant
);

calendarRouter.get(
  "/getParticipants/:calendarId",
  userAuth,
  getParticipants
);

calendarRouter.get(
  "/getCalendar/:calendarId",
  userAuth,
  getCalendar
);

calendarRouter.get(
  "/getSharedCalendar/:calendarId",
  userAuth,

  getSharedCalendar
);

export default calendarRouter;