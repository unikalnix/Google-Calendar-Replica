import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { create, readAll,readAllShared, deleteOne } from "../controllers/calendar.js";

const calendarRouter = express.Router();

calendarRouter.post("/create", userAuth, create);
calendarRouter.get("/readAll", userAuth, readAll);
calendarRouter.get("/readAllShared", userAuth, readAllShared); // Read all calendars shared with me by others
calendarRouter.post("/deleteOne/:id", userAuth, deleteOne);

export default calendarRouter;
