import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { makeRequest } from "../controllers/request/calendar.js";

const requestRouter = express.Router();

requestRouter.get("/calendar", userAuth, makeRequest);
export default makeRequest;
