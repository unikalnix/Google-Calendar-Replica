import express from "express";
import { login, signup, logout } from "../controllers/user.js";
import userAuth from '../middlewares/userAuth.js'

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/logout", userAuth, logout);

export default userRouter;
