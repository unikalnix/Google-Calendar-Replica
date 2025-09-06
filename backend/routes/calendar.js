import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {create, readAll} from '../controllers/calendar.js'

const calendarRouter = express.Router();

calendarRouter.post("/create", userAuth, create);
calendarRouter.get("/readAll", userAuth, readAll);

export default calendarRouter;
