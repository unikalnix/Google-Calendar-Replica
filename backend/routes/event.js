import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { create, readAll } from "../controllers/event.js";

const eventRouter = express.Router();

eventRouter.post("/create", userAuth, create);
eventRouter.get("/readAll", userAuth, readAll);

export default eventRouter;
