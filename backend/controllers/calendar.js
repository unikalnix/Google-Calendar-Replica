import calendarModel from "../models/calendar.js";
import userModel from "../models/user.js";
import mongoose from "mongoose";
import { sendNotificationToUsers } from "../utils/socket.js";

const create = async (req, res) => {
  const { name, color, isShared, sharedWith, autoRemove } =
    req.body.calendarData;

  const payload = req.user;
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

    const user = await userModel.findOne({ _id: payload.id });
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

    // If ->  isShared === true
    // then -> Send an email here to the users have their id's in the sharedWith array
    if (isShared) {
      const users = await userModel.find({
        email: { $in: sharedWith.map((s) => s.email) },
      });
      const userIds = users.map((u) => u._id.toString());
      const { sharedWith: _, ...calendarData } = calendar.toObject();
      const user = await userModel.findById(calendarData.owner);
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
    const payload = req.user; //login user id
    const user = await userModel.findOne({ _id: payload.id }); // login user document
    if (!user) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    const sharedWithMe = await calendarModel.find({
      "sharedWith.email": payload.email,
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

const readAll = async (req, res) => {
  try {
    const payload = req.user;
    const user = await userModel.findOne({ _id: payload.id });
    if (!user) {
      return res.json({ success: false, message: "Something went wrong" });
    }

    const calendars = await calendarModel.find({
      _id: { $in: user.calendars },
    });

    const updatedCalendars = calendars.map((c) => {
      return {
        ...c.toObject(),
        owner: payload.email,
      };
    });

    if (calendars.length === 0) {
      return res.json({ success: false, message: "No calendars found" });
    }

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
    const { id } = req.params;
    const payload = req.user;

    const cal = await calendarModel.findOneAndDelete({
      owner: new mongoose.Types.ObjectId(payload.id),
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!cal) {
      return res.json({
        success: false,
        message: "Calendar Not Found or Already Deleted",
      });
    }

    const user = await userModel.findOne({
      _id: payload.id,
    });

    user.calendars = user.calendars.filter(
      (c) => c.toString() !== cal._id.toString()
    );

    await user.save();

    if (cal.sharedWith && cal.sharedWith.length > 0) {
      const emails = cal.sharedWith.map((x) => x.email);
      const users = await userModel.find({ email: { $in: emails } }, "_id");
      const participantIds = users.map((u) => u._id.toString());
      const { name: owner } = await userModel.findOne({
        _id: new mongoose.Types.ObjectId(cal.owner),
      });
      sendNotificationToUsers(participantIds, cal, owner, "deleted");
    }

    return res.json({
      success: true,
      message: `${cal.name} Calendar deleted`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const shareCalendar = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { id: calId } = req.params;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const calendar = await calendarModel.findById(calId);
    if (!calendar) {
      return res.json({ return: false, message: "Calendar not found" });
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
    const owner = await userModel.findOne({ _id: calendar.owner });
    sendNotificationToUsers(
      isUser._id.toString(),
      calendar,
      owner.name,
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
    const payload = req.user;
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
    const { id: cid } = req.params;
    const { pEmail } = req.body;

    const calendar = await calendarModel.findById(cid);
    if (!calendar) {
      return res.json({ success: false, message: "Calendar not found" });
    }

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

    const { name: ownerName } = await userModel.findById(calendar.owner).lean();
    removedUser = await userModel.findOne({ email: removedUser.email });

    if (removedUser) {
      let response = await sendNotificationToUsers(
        removedUser._id,
        calendar,
        ownerName,
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
    console.log("Request reached");
    const { id } = req.params; // calendar id

    const calendar = await calendarModel.findById(id);
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
export {
  create,
  readAll,
  deleteOne,
  readAllShared,
  shareCalendar,
  updateRole,
  removeParticipant,
  getParticipants,
};
