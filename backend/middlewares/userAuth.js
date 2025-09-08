import { verifyToken } from "../utils/token.js";
import mongoose from "mongoose";

async function userAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Token not found" });
    }

    let payload = verifyToken(token);
    if (payload === null) {
      return res.json({ success: false, message: "Invalid token" });
    }
    
    req.user = payload;
    req.token = token;
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
}

export default userAuth;
