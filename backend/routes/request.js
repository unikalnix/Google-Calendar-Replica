import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { makeRequest, getRequests, respondToRequest, getRequestsHistory, revokeAccess } from "../controllers/request/calendar.js";

const requestRouter = express.Router();

requestRouter.post("/makeRequest", userAuth, makeRequest);
requestRouter.get("/getRequests", userAuth, getRequests)
requestRouter.get("/getRequestsHistory", userAuth, getRequestsHistory)
requestRouter.patch("/respondToRequest", userAuth, respondToRequest)
requestRouter.post("/revokeAccess", userAuth, revokeAccess)
export default requestRouter;
