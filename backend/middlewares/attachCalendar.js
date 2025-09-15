import calendarModel from "../models/calendar.js";
import mongoose from "mongoose";

const attachCalendar = async (req, res, next) => {
  try {
    let calendarId = (req.body && req.body.calendarId) || req.params.calendarId;
    console.log(calendarId)

    if (!calendarId) {
      return res.json({
        success: false,
        message: "Provide Calendar",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(calendarId)) {
      new mongoose.Types.ObjectId(calendarId);
    }

    const calendar = await calendarModel.findById(calendarId);

    if (!calendar) {
      return res.json({ success: false, message: "Calendar not found" });
    }

    req.calendar = calendar;
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { attachCalendar };
