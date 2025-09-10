import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { create, readAll,readAllShared, deleteOne, shareCalendar, updateRole, removeParticipant, getParticipants } from "../controllers/calendar.js";

const calendarRouter = express.Router();

calendarRouter.post("/create", userAuth, create);
calendarRouter.get("/readAll", userAuth, readAll);
calendarRouter.get("/readAllShared", userAuth, readAllShared); // Read all calendars shared with me by others
calendarRouter.post("/deleteOne/:id", userAuth, deleteOne);
calendarRouter.post("/share/:id", userAuth, shareCalendar);
calendarRouter.put("/updateRole", userAuth, updateRole);
calendarRouter.delete("/deleteParticipant/:id", userAuth, removeParticipant);
calendarRouter.get("/getParticipants/:id", userAuth, getParticipants); // /:id -> calendar id

export default calendarRouter;
