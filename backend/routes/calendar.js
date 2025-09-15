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
import { attachUser } from "../middlewares/attachUser.js";
import { attachCalendar } from "../middlewares/attachCalendar.js";
import { roleAuth } from "../middlewares/roleAuth.js";

const calendarRouter = express.Router();

calendarRouter.post("/create", userAuth, attachUser, create);
calendarRouter.get("/readAllShared", userAuth, attachUser, readAllShared); // Read all calendars shared with me by others
calendarRouter.get("/getMyCalendars", userAuth, attachUser, getMyCalendars);
calendarRouter.put("/updateRole", userAuth, updateRole);

calendarRouter.post(
  "/deleteOne/:calendarId",
  userAuth,
  attachUser,
  attachCalendar,
  roleAuth("deleteCalendar"),
  deleteOne
);

calendarRouter.post(
  "/share/:calendarId",
  userAuth,
  attachUser,
  attachCalendar,
  shareCalendar
);


calendarRouter.delete(
  "/deleteParticipant/:calendarId",
  userAuth,
  attachUser,
  attachCalendar,
  removeParticipant
);

calendarRouter.get(
  "/getParticipants/:calendarId",
  userAuth,
  attachCalendar,
  getParticipants
);

calendarRouter.get(
  "/getCalendar/:calendarId",
  userAuth,
  attachUser,
  attachCalendar,
  getCalendar
);

calendarRouter.get(
  "/getSharedCalendar/:calendarId",
  userAuth,
  attachUser,
  attachCalendar,
  getSharedCalendar
);

export default calendarRouter;
