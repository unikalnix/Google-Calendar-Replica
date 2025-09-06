import eventModel from "../models/event.js";
import calendarModel from "../models/calendar.js";

const create = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      participants,
      repeat,
      calendar: calendarName,
    } = req.body;

    if (!title || !startTime || !endTime || !calendarName) {
      return res.json({
        success: false,
        message: "Mentioned fields are required",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      return res.json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const calendar = await calendarModel.findOne({ name: calendarName });
    if (!calendar) {
      return res.json({ success: true, message: "Calendar not found" });
    }

    const isTimeSlotFree = !(await eventModel.exists({
      calendar: calendar._id,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    }));

    if (!isTimeSlotFree) {
      return res.json({
        success: false,
        message: "An event in this Calendar already exists",
      });
    }

    const newEvent = await eventModel.create({
      title,
      description,
      startTime: start,
      endTime: end,
      location,
      participants,
      repeat,
      calendar: calendar._id,
    });

    calendar.events.push(newEvent._id);
    await calendar.save();

    return res.json({
      success: true,
      message: "Event created successfully",
      newEvent,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const readAll = async (req, res) => {
  try {
    const events = await eventModel.find();
    return res.json({
      success: true,
      message: "All events fetched successfully",
      events,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { create, readAll };
