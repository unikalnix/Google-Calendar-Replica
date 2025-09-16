import calendarModel from "../models/calendar.js";
import userModel from "../models/user.js";
import eventModel from "../models/event.js";
import mongoose from "mongoose";
import { sendNotificationToUsers } from "../utils/socket.js";

const create = async (req, res) => {
  const { name, color, isShared, sharedWith, autoRemove } =
    req.body.calendarData;
  const user = req.user;

  const payload = req.payload;
  if (!name) {
    return res.json({ success: false, message: "Name is required" });
  }

  try {
    const isCalNameExists = await calendarModel.exists({
      owner: new mongoose.Types.ObjectId(payload.id),
      name,
    });

    if (isCalNameExists) {
      return res.json({
        success: false,
        message: `${name} Calendar already exists`,
      });
    }

    let requestedEmails;
    let users;
    if (isShared) {
      requestedEmails = sharedWith.map((s) => s.email);
      users = await userModel.find({
        email: { $in: requestedEmails },
      });
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

    const calendar = await calendarModel.create({
      name,
      color,
      isShared,
      sharedWith,
      autoRemove,
      owner: payload.id,
    });

    user.calendars.push(calendar._id);
    await user.save();

    if (isShared) {
      const userIds = users.map((u) => u._id.toString());
      const { sharedWith: _, ...calendarData } = calendar.toObject(); // remove shared with field
      sendNotificationToUsers(userIds, calendarData, user.name, "created");
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
    const user = req.user;

    const sharedWithMe = await calendarModel.find({
      "sharedWith.email": user.email,
    });

    if (sharedWithMe.length === 0) {
      return res.json({
        success: false,
        message: "No shared calendars with you.",
      });
    }

    return res.json({
      success: true,
      message: "All shared calendars fetched successfully",
      length: sharedWithMe.length,
      sharedWithMe,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getMyCalendars = async (req, res) => {
  try {
    const payload = req.payload;
    const user = req.user;

    const calendars = await calendarModel.find({
      _id: { $in: user.calendars },
    });

    if (calendars.length === 0) {
      return res.json({ success: false, message: "No calendars found" });
    }

    const updatedCalendars = calendars.map((c) => {
      return {
        ...c.toObject(),
        owner: payload.email,
      };
    });

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
    const user = req.user;
    const calendar = req.calendar;

    let participants = calendar.sharedWith.length;
    let emails;
    let users;
    let participantIds;
    if (participants > 0) {
      emails = calendar.sharedWith.map((x) => x.email);
      users = await userModel.find({ email: { $in: emails } }, "_id");
      participantIds = users.map((u) => u._id.toString());
    }

    if (calendar.events && calendar.events.length > 0) {
      await eventModel.deleteMany({ _id: { $in: calendar.events } });
    }

    await calendar.deleteOne();
    await user.updateOne({
      $pull: { calendars: calendar._id },
    });

    if (participants > 0) {
      sendNotificationToUsers(participantIds, calendar, user.name, "deleted");
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
    const user = req.user;
    const { email, role } = req.body;
    const calendar = req.calendar;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const isUser = await userModel.findOne({ email: email });
    if (!isUser) {
      return res.json({ success: false, message: "User is not registered" });
    }

    const isCalAlreadyShared = calendar.sharedWith.find(
      (f) => f.email === email
    );

    if (isCalAlreadyShared) {
      return res.json({
        success: false,
        message: `User already participant of the calendar as ${isCalAlreadyShared.role}`,
      });
    }

    if (!calendar.isShared) calendar.isShared = true;
    calendar.sharedWith.push({ email, role });

    await calendar.save();
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

    const calendar = await calendarModel.findOne({ owner: payload.id });

    if (!calendar) {
      return res.json({ success: false, message: "Calendar not found" });
    }

    const found = calendar.sharedWith.find((u) => String(u._id) === String(id));

    if (!found) {
      return res.json({
        success: false,
        message: "Calendar is not shared with the user",
      });
    }

    found.role = role;
    await calendar.save();

    return res.json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const removeParticipant = async (req, res) => {
  try {
    const calendar = req.calendar;
    const user = req.user;
    const { pEmail } = req.body;

    const p = calendar.sharedWith.find((f) => f.email === pEmail);
    if (!p) {
      return res.json({
        success: false,
        message: "Participant already removed",
      });
    }

    let removedUser = null;
    const updatedParticipants = calendar.sharedWith.filter((s) => {
      if (s.email === pEmail) {
        removedUser = s;
        return false;
      }
      return true;
    });
    calendar.sharedWith = updatedParticipants;

    removedUser = await userModel.findOne({ email: removedUser.email });

    if (removedUser) {
      let response = await sendNotificationToUsers(
        removedUser._id,
        calendar,
        user.name,
        "removed"
      );

      if (!response.success) {
        return res.json(response);
      }
    }

    await calendar.save();
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
    const calendar = req.calendar;
    const participantEmails = calendar.sharedWith.map((s) => s.email);

    const participants = await userModel
      .find({ email: { $in: participantEmails } })
      .select("name email");

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
    const { name, events, color } = req.calendar;

    const allEvents = await eventModel
      .find({ _id: { $in: events } })
      .select("_id title description startTime createdAt");
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
    const user = req.user;
    const calendar = req.calendar;

    if (!calendar) {
      return res
        .status(404)
        .json({ success: false, message: "Calendar not found" });
    }

    let role = "none";

    if (String(calendar.owner) === String(user._id)) {
      role = "owner";
    } else {
      const sharedEntry = calendar.sharedWith.find(
        (u) => u.email === user.email
      );
      if (sharedEntry) role = sharedEntry.role;
    }

    if (role === "none") {
      return res.json({
        success: false,
        message: "You do not have access to this calendar",
      });
    }

    await calendar.populate([{
      path: "events",
      select: "title description startTime endTime",
    }, {
      path: "owner",
      select: "name",
    }]);

    return res.json({
      success: true,
      message: "Fetched shared calendar successfully",
      calendar: {
        _id: calendar._id,
        name: calendar.name,
        color: calendar.color,
        isShared: calendar.isShared,
        role: role,
        owner:calendar.owner,
        events: calendar.events,
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
