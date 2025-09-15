import userModel from "../models/user.js";
import mongoose from "mongoose";

export const attachUser = async (req, res, next) => {
  try {
    const { id, email, name } = req.payload;
    const user = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      name,
      email,
    });

    if (!user)
      return res.json({ success: false, message: "Something went wrong" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
