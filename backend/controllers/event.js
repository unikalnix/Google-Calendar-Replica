import { Event, EventParticipants } from "../models/event.js";
import { Calendar, CalendarParticipants } from "../models/calendar.js";
import { sendEmail } from "../utils/email/email.js";
import { eventInvitationTemplate } from "../utils/email/eventInvitationTemplate.js";
import { eventCancellationTemplate } from "../utils/email/eventCancellationTemplate.js";
import { eventUpdateTemplate } from "../utils/email/eventUpdateTemplate.js";
import { scheduleReminderJob } from "../queues/reminder.js";
import mongoose from "mongoose";
import { PERMISSIONS } from "../utils/permissions.js";

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      start,
      end,
      location,
      participants,
      repeat,
      calendarId,
      reminderMinutes,
      isShared,
      person,
    } = req.body;

    const user = req.payload;
    if (!calendarId)
      return res.json({ success: false, message: "Provide Calendar" });

    if (!title || !start || !end) {
      return res.json({ success: false, message: "Required fields missing" });
    }

    if (isShared && person?.role) {
      if (person.role === PERMISSIONS.VIEWER) {
        let role = person.role.charAt(0).toUpperCase() + person.role.slice(1);
        return res.json({
          success: false,
          message: `${role}s cannot create events in a shared calendar`,
        });
      }
      if (person.role !== PERMISSIONS.OWNER) {
        return res.json({
          success: false,
          message:
            "You do not have permission to create events in this calendar",
        });
      }
    }

    const startEvent = new Date(start);
    const endEvent = new Date(end);

    if (startEvent >= endEvent) {
      return res.json({ success: false, message: "Start must be before end" });
    }

    const overlappingEvent = await Event.findOne({
      calendar: calendarId,
      $and: [
        { startTime: { $lt: endEvent } },
        { endTime: { $gt: startEvent } },
      ],
    });

    if (overlappingEvent) {
      return res.json({
        success: false,
        message: "Another event already exists in this time slot",
      });
    }

    await scheduleReminderJob(
      {
        title,
        description,
        calendar: calendarId,
        startTime: startEvent,
        endTime: endEvent,
        location,
        participants,
        repeat,
        reminderMinutes: reminderMinutes || 0,
        owner: user.id,
      },
      user.name
    );

    const newEvent = await Event.create({
      title,
      description,
      calendar: calendarId,
      startTime: startEvent,
      endTime: endEvent,
      location,
      repeat,
      reminderMinutes: reminderMinutes || 0,
      owner: user.id,
    });

    await Calendar.findByIdAndUpdate(calendarId, {
      $push: { events: newEvent._id },
    });

    res.json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = req.payload;

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

    const ownedCalendars = await Calendar.find({
      owner: new mongoose.Types.ObjectId(user.id),
    }).select("_id");

    const sharedCalendars = await CalendarParticipants.find({
      email: user.email,
    }).select("calendarId role");

    const calendarIds = [
      ...ownedCalendars.map((c) => c._id),
      ...sharedCalendars.map((p) => p.calendarId),
    ];

    const events = await Event.find({
      calendar: { $in: calendarIds },
      $or: [
        { startTime: { $gte: start, $lte: end } },
        { endTime: { $gte: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } },
      ],
    }).populate("calendar", "name color");

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
    const { calendarId, eventId } = req.params;
    const user = req.payload;
    const calendar = await Calendar.findOne({
      _id: new mongoose.Types.ObjectId(calendarId),
    });

    if (!calendar)
      return res.json({ success: false, message: "Calendar not found" });

    const event = await Event.findOne({
      calendar: new mongoose.Types.ObjectId(calendarId),
      _id: new mongoose.Types.ObjectId(eventId),
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

    const eventParticipants = await EventParticipants.find({
      eventId: new mongoose.Types.ObjectId(eventId),
    });
    eventData.participants = eventParticipants;
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
    const { eventId, calendarId } = req.params;
    const user = req.payload;
    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      return res.json({ success: false, message: "Calendar not found" });
    }

    const event = await Event.findOne({
      _id: new mongoose.Types.ObjectId(eventId),
      calendar: calendar._id,
    });
    if (!event) {
      return res.json({
        success: false,
        message: "Event not found or already deleted",
      });
    }

    const participant = await EventParticipants.findOne({
      eventId,
      email: user.email,
      role: { $in: [PERMISSIONS.OWNER, PERMISSIONS.EDITOR] },
    });

    if (!participant) {
      return res.json({
        success: false,
        message: "You do not have permission to delete this event",
      });
    }

    const participants = await EventParticipants.find({ eventId });

    if (participants.length > 0) {
      const emailPromises = participants.map((p) => {
        const htmlTemplate = eventCancellationTemplate({
          participantName: p.name,
          organizerName: user.name,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          location: event.location,
        });
        sendEmail(p.email, `Cancelled: ${event.title}`, htmlTemplate);
      });
      Promise.all(emailPromises);
    }

    await EventParticipants.deleteMany({ eventId });
    await event.deleteOne();

    return res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = req.body;
    const user = req.payload;

    if (new Date(eventData.startTime) >= new Date(eventData.endTime)) {
      return res.json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.json({ success: false, message: "Event not found" });
    }
    console.log(eventData.person.role);
    if (
      ![PERMISSIONS.OWNER, PERMISSIONS.EDITOR].includes(eventData?.person.role)
    ) {
      return res.json({
        success: false,
        message: "You do not have permission to update this event.",
      });
    }

    if (existingEvent.calendar.toString() !== eventData.calendarId) {
      return res.json({
        success: false,
        message: "Invalid calendar. You cannot update to a different calendar.",
      });
    }

    const { startTime, endTime } = eventData;

    const overlappingEvent = await Event.findOne({
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

    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, {
      new: true,
    });
    await scheduleReminderJob(updatedEvent, user.name);

    const oldParticipants = await EventParticipants.find({ eventId }).lean();
    const oldEmails = oldParticipants.map((p) => p.email);

    const newParticipants = eventData.participants || [];
    const addedParticipants = newParticipants.filter(
      (p) => !oldEmails.includes(p.email)
    );
    const existingParticipants = newParticipants.filter((p) =>
      oldEmails.includes(p.email)
    );

    if (addedParticipants.length > 0) {
      await EventParticipants.insertMany(
        addedParticipants.map((p) => ({ ...p, eventId }))
      );
    }

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
