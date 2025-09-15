import eventModel from "../models/event.js";
import calendarModel from "../models/calendar.js";
import { sendEmail } from "../utils/email/email.js";
import { eventInvitationTemplate } from "../utils/email/eventInvitationTemplate.js";
import { eventCancellationTemplate } from "../utils/email/eventCancellationTemplate.js";
import { eventUpdateTemplate } from "../utils/email/eventUpdateTemplate.js";
import { scheduleReminderJob } from "../queues/reminder.js";

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      participants,
      repeat,
      reminderMinutes,
    } = req.body;
    const user = req.user;
    const { _id: calendarId } = req.calendar;

    if (!title || !startTime || !endTime) {
      return res.json({ success: false, message: "Required fields missing" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      return res.json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    const overlappingEvent = await eventModel.findOne({
      calendar: calendarId,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (overlappingEvent) {
      return res.json({
        success: false,
        message: "Another event already exists in this time slot",
      });
    }

    const newEvent = await eventModel.create({
      title,
      description,
      calendar: calendarId,
      startTime: start,
      endTime: end,
      location,
      participants,
      repeat,
      reminderMinutes,
      owner: user._id,
    });

    await scheduleReminderJob(newEvent, user.name);

    await calendarModel.findByIdAndUpdate(calendarId, {
      $push: { events: newEvent._id },
    });

    const emailPromises = participants.map((p) => {
      const htmlTemplate = eventInvitationTemplate({
        participantName: p.name,
        organizerName: user.name,
        title,
        description,
        start,
        end,
        location,
      });

      return sendEmail(p.email, `Invitation: ${title}`, htmlTemplate);
    });

    const responses = await Promise.all(emailPromises);

    res.json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
      email: responses,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = req.user;

    if (!startDate || !endDate) {
      return res.json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.json({
        success: false,
        message: "Invalid date format",
      });
    }

    const events = await eventModel
      .find({
        owner: user._id,
        $or: [
          { startTime: { $gte: start, $lte: end } }, // starts inside
          { endTime: { $gte: start, $lte: end } }, // ends inside
          { startTime: { $lte: start }, endTime: { $gte: end } }, // spans full range
        ],
      })
      .populate("calendar", "name color");

    return res.json({
      success: true,
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const getEvent = async (req, res) => {
  try {
    const user = req.user;
    const calendar = req.calendar;
    const { eventId } = req.params;

    const event = await eventModel.findOne({
      calendar: calendar._id,
      _id: eventId,
    });

    if (!event) {
      res.json({ success: false, message: "Event not found" });
    }

    await calendar.populate("owner", "name");
    const eventOwner = calendar.owner.name;

    let eventData = {
      ...event.toObject(),
    };
    eventData.owner = eventOwner;
    eventData.calendar = calendar.name;

    res.json({
      success: true,
      message: "Event fetched successfully",
      eventData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const calendar = req.calendar;
    const { eventId } = req.params;
    const user = req.user;

    const event = await eventModel.findOne({
      _id: eventId,
      calendar: calendar._id,
    });

    if (!event)
      return res.json({
        success: false,
        message: "Event not found or already deleted",
      });

    const emailPromises = event.participants.map((p) => {
      const htmlTemplate = eventCancellationTemplate({
        participantName: p.name,
        organizerName: user.name,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        location: event.location,
      });

      return sendEmail(p.email, `Cancelled: ${event.title}`, htmlTemplate);
    });

    await Promise.all(emailPromises);

    await event.deleteOne();
    await calendarModel.findByIdAndUpdate(calendar._id, {
      $pull: { events: eventId },
    });

    return res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = req.body;
    const user = req.user;

    if (new Date(eventData.startTime) >= new Date(eventData.endTime)) {
      return res.json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const existingEvent = await eventModel.findById(eventId);
    if (!existingEvent) {
      return res.json({ success: false, message: "Event not found" });
    }

    if (existingEvent.calendar.toString() !== eventData.calendarId) {
      return res.json({
        success: false,
        message: "Invalid calendar. You cannot update to a different calendar.",
      });
    }

    const { startTime, endTime } = eventData;

    const overlappingEvent = await eventModel.findOne({
      _id: { $ne: eventId },
      calendar: existingEvent.calendar,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingEvent) {
      return res.json({
        success: false,
        message: `Time overlaps with another event: "${overlappingEvent.title}"`,
      });
    }

    const oldParticipants = existingEvent.participants.map((p) => p.email);
    const newParticipants = eventData.participants.map((p) => p.email);

    const addedParticipants = eventData.participants.filter(
      (p) => !oldParticipants.includes(p.email)
    );
    const existingParticipants = eventData.participants.filter((p) =>
      oldParticipants.includes(p.email)
    );

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      eventData,
      { new: true }
    );
    await scheduleReminderJob(updatedEvent, user.name);

    const invitePromises = addedParticipants.map((p) => {
      const htmlTemplate = eventInvitationTemplate({
        participantName: p.name,
        organizerName: user.name,
        title: updatedEvent.title,
        description: updatedEvent.description,
        start: updatedEvent.startTime,
        end: updatedEvent.endTime,
        location: updatedEvent.location,
      });
      return sendEmail(
        p.email,
        `Invitation: ${updatedEvent.title}`,
        htmlTemplate
      );
    });

    const updatePromises = existingParticipants.map((p) => {
      const htmlTemplate = eventUpdateTemplate({
        participantName: p.name,
        organizerName: user.name,
        title: updatedEvent.title,
        description: updatedEvent.description,
        start: updatedEvent.startTime,
        end: updatedEvent.endTime,
        location: updatedEvent.location,
      });
      return sendEmail(p.email, `Updated: ${updatedEvent.title}`, htmlTemplate);
    });

    await Promise.all([...invitePromises, ...updatePromises]);

    return res.json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { createEvent, getEvents, getEvent, deleteEvent, updateEvent };
