import { Calendar, CalendarParticipants } from "../models/calendar.js";
import User from "../models/user.js";
import { Event } from "../models/event.js";
import mongoose from "mongoose";
import { sendNotificationToUsers } from "../utils/socket.js";
import { PERMISSIONS } from "../utils/permissions.js";

const create = async (req, res) => {
  const { name, color, isShared, sharedWith, autoRemove } = !req.body
    .calendarData
    ? req.body
    : req.body.calendarData;
  const payload = req.payload;
  if (!name) {
    return res.json({ success: false, message: "Name is required" });
  }

  try {
    const isCalNameExists = await Calendar.exists({
      owner: new mongoose.Types.ObjectId(payload.id),
      name,
    });

    if (isCalNameExists) {
      return res.json({
        success: false,
        message: `${name} Calendar already exists`,
      });
    }

    let users = [];
    if (isShared && sharedWith && sharedWith.length > 0) {
      const requestedEmails = sharedWith.map((s) => s.email);
      users = await User.find({ email: { $in: requestedEmails } });
      const foundEmails = users.map((u) => u.email);
      const notFoundEmails = requestedEmails.filter(
        (email) => !foundEmails.includes(email)
      );
      if (notFoundEmails.length > 0)
        return res.json({
          success: false,
          message: `${notFoundEmails.join(", ")} are not registered with us!`,
        });
    }

    const calendar = await Calendar.create({
      name,
      color,
      isShared,
      autoRemove,
      owner: payload.id,
    });

    if (isShared && sharedWith && sharedWith.length > 0) {
      const participantDocs = sharedWith.map((participant) => ({
        email: participant.email,
        role: participant.role,
        calendarId: calendar._id,
      }));
      await CalendarParticipants.insertMany(participantDocs);

      const userIds = users.map((u) => u._id.toString());
      const { sharedWith: _, ...calendarData } = calendar.toObject(); // remove shared with field
      sendNotificationToUsers(userIds, calendarData, payload.name, "created");
    }

    return res.json({
      success: true,
      message: "Calendar created successfully",
      calendar,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const readAllShared = async (req, res) => {
  try {
    const payload = req.payload;

    const sharedWithMe = await CalendarParticipants.find({
      email: payload.email,
    }).populate("calendarId", "name");

    if (sharedWithMe.length === 0) {
      return res.json({
        success: false,
        message: "No shared calendars with you.",
      });
    }
    const formatted = sharedWithMe.map(({ _id, email, role, calendarId }) => ({
      _id,
      calendarId: calendarId?._id || "",
      name: calendarId?.name || "",
      email,
      role,
    }));

    return res.json({
      success: true,
      message: "All shared calendars fetched successfully",
      length: formatted.length,
      sharedWithMe: formatted,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getMyCalendars = async (req, res) => {
  try {
    const payload = req.payload;
    const calendars = await Calendar.find({
      owner: new mongoose.Types.ObjectId(payload.id),
    });

    if (calendars.length === 0) {
      return res.json({ success: false, message: "No calendars found" });
    }

    let updatedCalendars = calendars.map((c) => {
      return {
        ...c.toObject(),
        owner: payload.email,
      };
    });

    const allParticipants = await CalendarParticipants.find({
      calendarId: { $in: updatedCalendars.map((i) => i._id) },
    });

    const participantsMap = {};
    allParticipants.forEach((p) => {
      const key = p.calendarId.toString();
      if (!participantsMap[key]) participantsMap[key] = [];
      // Exclude calendarId and __v from participant object
      const { calendarId, __v, ...rest } = p.toObject();
      participantsMap[key].push(rest);
    });

    updatedCalendars = updatedCalendars.map((cal) => ({
      ...cal,
      sharedWith: participantsMap[cal._id.toString()] || [],
    }));

    return res.json({
      success: true,
      message: "All calendars fetched successfully",
      calendars: updatedCalendars,
      length: calendars.length,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deleteOne = async (req, res) => {
  try {
    const payload = req.payload;
    const { calendarId: calId } = req.params;
    const role = req.body?.role;
    const shared = req.body?.shared;
    const calendar = await Calendar.findById(calId);
    if (!calendar)
      return res.json({ success: false, message: "Calendar not found" });

    if (shared) {
      if (role !== PERMISSIONS.OWNER)
        return res.json({ success: false, message: "Permission denied" });
    }

    if (calendar.isDefault)
      return res.json({
        success: false,
        message: "You can't delete the default calendar",
      });

    let participants = await CalendarParticipants.find({
      calendarId: calendar._id,
    });

    let emails;
    let users;
    let participantIds;
    if (participants && participants.length > 0) {
      emails = participants.map((p) => p.email);
      users = await User.find({ email: { $in: emails } }, "_id");
      participantIds = users.map((u) => u._id.toString());
    }

    await calendar.deleteOne();
    await CalendarParticipants.deleteMany({ calendarId: calendar._id });
    await Event.deleteMany({ calendar: calendar._id });
    if (participants.length > 0) {
      sendNotificationToUsers(
        participantIds,
        calendar,
        payload.name,
        "deleted"
      );
    }

    return res.json({
      success: true,
      message: `${calendar.name} Calendar deleted`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const shareCalendar = async (req, res) => {
  try {
    const user = req.payload;
    const { email, role } = req.body;
    const { calendarId: calId } = req.params;
    const calendar = await Calendar.findOne({
      owner: new mongoose.Types.ObjectId(user.id),
      _id: new mongoose.Types.ObjectId(calId),
    });

    if (!calendar)
      return res.json({ success: false, message: "Calendar not found" });

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const isUser = await User.findOne({ email: email });
    if (!isUser) {
      return res.json({ success: false, message: "User is not registered" });
    }
    const existingParticipant = await CalendarParticipants.findOne({
      email,
      calendarId: new mongoose.Types.ObjectId(calId),
    });

    if (existingParticipant) {
      existingParticipant.role = role;
      await existingParticipant.save();

      sendNotificationToUsers(
        isUser._id.toString(),
        calendar,
        user.name,
        "shared"
      );

      return res.json({
        success: true,
        message: `Role updated for ${email} to ${role} in ${calendar.name}`,
      });
    }

    if (!calendar.isShared) {
      calendar.isShared = true;
      await calendar.save();
    }

    await CalendarParticipants.create({
      email,
      role,
      calendarId: new mongoose.Types.ObjectId(calId),
    });

    sendNotificationToUsers(
      isUser._id.toString(),
      calendar,
      user.name,
      "shared"
    );

    return res.json({
      success: true,
      message: `You shared ${calendar.name} to ${email} as ${role}`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.query;
    const payload = req.payload;
    const { id } = req.body;

    if (!role) {
      return res.json({ success: false, message: "Role is not defined" });
    }

    const calendar = await Calendar.findOne({ owner: payload.id });

    if (!calendar) {
      return res.json({ success: false, message: "Calendar not found" });
    }

    const found = await CalendarParticipants.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!found) {
      return res.json({
        success: false,
        message: "Calendar is not shared with the user",
      });
    }

    found.role = role;
    await found.save();

    return res.json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const removeParticipant = async (req, res) => {
  try {
    const user = req.payload;
    const { calendarId: calId } = req.params;
    const { pEmail } = req.body; // i am sure email is given
    const calendar = await Calendar.findOne({
      owner: user.id,
      _id: new mongoose.Types.ObjectId(calId),
    });
    if (!calendar)
      return res.json({ success: false, message: "Calendar not found" });
    const calendarParticipant = await CalendarParticipants.findOne({
      email: pEmail,
      calendarId: calendar._id,
    });
    if (!calendarParticipant) {
      return res.json({
        success: false,
        message: "Participant already removed",
      });
    }

    await CalendarParticipants.deleteOne({ _id: calendarParticipant._id });

    const removedUser = await User.findOne({ email: pEmail });
    if (removedUser) {
      let response = await sendNotificationToUsers(
        removedUser._id.toString(),
        calendar,
        user.name,
        "removed"
      );
      if (response && !response.success) {
        return res.json(response);
      }
    }

    return res.json({
      success: true,
      message: "Participant removed successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getParticipants = async (req, res) => {
  try {
    const { calendarId: calId } = req.params;

    const calendarParticipants = await CalendarParticipants.find({
      calendarId: new mongoose.Types.ObjectId(calId),
    });

    if (calendarParticipants.length === 0)
      return res.json({ success: false, message: "No participants found" });
    const participantEmails = calendarParticipants.map((s) => s.email);

    const participants = await User.find({
      email: { $in: participantEmails },
    }).select("name email");

    if (participants.length === 0)
      return res.json({
        success: false,
        message:
          "No participants found. This calendar has not been shared with anyone yet.",
      });

    res.json({
      success: true,
      message: "",
      participants,
      length: participants.length,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getCalendar = async (req, res) => {
  try {
    const { calendarId } = req.params;
    const user = req.payload;
    const calendar = await Calendar.findOne({
      _id: new mongoose.Types.ObjectId(calendarId),
      owner: new mongoose.Types.ObjectId(user.id),
    });

    if (!calendar)
      return res.json({ success: false, message: "Calendar not found" });

    const { name, color } = calendar;

    const allEvents = await Event.find({ calendar: calendar._id }).select(
      "_id title description startTime createdAt"
    );
    res.json({
      success: true,
      message: "Calendar fetched successfully",
      name,
      color,
      events: allEvents,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getSharedCalendar = async (req, res) => {
  try {
    const user = req.payload;
    const { calendarId } = req.params;

    const calendar = await Calendar.findOne({
      _id: new mongoose.Types.ObjectId(calendarId),
    });

    if (!calendar) {
      return res.json({ success: false, message: "Calendar not found" });
    }

    let role = "none";

    if (String(calendar.owner) === String(user.id)) {
      role = "owner";
    } else {
      const sharedEntry = await CalendarParticipants.findOne({
        email: user.email,
      });
      if (sharedEntry) role = sharedEntry.role;
    }

    if (role === "none") {
      return res.json({
        success: false,
        message: "You do not have access to this calendar",
      });
    }

    await calendar.populate("owner", "name");
    const events = await Event.find({
      calendar: new mongoose.Types.ObjectId(calendarId),
    });

    return res.json({
      success: true,
      message: "Fetched shared calendar successfully",
      calendar: {
        _id: calendar._id,
        name: calendar.name,
        color: calendar.color,
        isShared: calendar.isShared,
        role: role,
        owner: calendar.owner,
        events,
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  create,
  getMyCalendars,
  getCalendar,
  deleteOne,
  readAllShared,
  shareCalendar,
  updateRole,
  removeParticipant,
  getParticipants,
  getSharedCalendar,
};