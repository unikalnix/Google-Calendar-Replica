import {
  RequestCalendar,
  RequestCalendarHistory,
} from "../../models/request/calendar.js";
import User from "../../models/user.js";
import validateEmail from "../../utils/emailValidator.js";
import { sendCalendarAccessRequest } from "../../utils/notifications/calendarRequest.js";
import mongoose from "mongoose";
import { sendNotificationToUsers } from "../../utils/socket.js";
import { CalendarParticipants, Calendar } from "../../models/calendar.js";
import { requestCalendar } from "../../utils/default.js";

const makeRequest = async (req, res) => {
  try {
    const {
      requesterName,
      requesterEmail,
      recipientEmail,
      requestType,
      message,
    } = req.body;

    if (!requesterName || !requesterEmail || !recipientEmail)
      return res.json({
        success: false,
        message: "Required fields are missing",
      });

    if (!validateEmail(requesterEmail))
      return res.json({ success: false, message: "Something went wrong" });

    const recipient = await User.findOne({ email: recipientEmail }).lean();
    if (recipient.email === requesterEmail)
      return res.json({
        success: false,
        message: "You are inviting yourself LOL",
      });
    if (!recipient)
      return res.json({ success: false, message: "User not found" });

    const newRequest = await RequestCalendar.create({
      requesterName,
      requesterEmail,
      recipientName: recipient.name,
      recipientEmail: recipient.email || recipientEmail,
      requestType,
      message,
    });

    sendCalendarAccessRequest(recipient._id, newRequest);
    return res.json({
      success: true,
      message: `Your request has been submitted to ${recipientEmail}`,
      newRequest,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: `An error occured in make request function: ${error.message}`,
    });
  }
};

const getRequests = async (req, res) => {
  try {
    const payload = req.payload;

    const requests = await RequestCalendar.find({
      recipientEmail: payload.email,
    });
    if (!requests)
      return res.json({ success: false, message: "Something went wrong" });
    if (requests && requests.length === 0)
      return res.json({ success: false, message: "You recieved no Requests" });

    return res.json({
      success: true,
      message: "Successfully fetched all requests",
      requests,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: `An error occured in getRequests function: ${error.message}`,
    });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const payload = req.payload;
    const { status, requestId, requesterEmail } = req.body;
    console.log(status, requestId);
    if (!status || !requestId || !requesterEmail)
      return res.json({ success: false, message: "Something went wrong" });

    const request = await RequestCalendar.findOne({
      _id: new mongoose.Types.ObjectId(requestId),
    });

    if (!request)
      return res.json({ success: false, message: "Request not found" });

    request.status = status;
    await request.save();

    const requester = await User.findOne({ email: requesterEmail });
    if (request.status === "granted") {
      const calendar = await Calendar.findOne({
        owner: new mongoose.Types.ObjectId(payload.id),
        isDefault: true,
      });
      if (!calendar)
        return res.json({
          success: false,
          message: "Something went wrong. Please try again",
        });
      await CalendarParticipants.create({
        email: requesterEmail,
        role: requestCalendar.defaultRole,
        calendarId: calendar._id,
      });

      sendNotificationToUsers(
        requester._id.toString(),
        calendar,
        payload.name,
        "shared"
      );
    }

    if (!requester)
      return res.json({
        success: false,
        message: "Something went wrong. Try again",
      });

    await RequestCalendarHistory.create({
      status,
      changedBy: new mongoose.Types.ObjectId(payload.id),
      requestBy: new mongoose.Types.ObjectId(requester._id),
      changedAt: new Date(),
      requestId,
    });

    return res.json({ success: true, message: `You ${status} the access` });
  } catch (error) {
    console.log(
      `An error occured in respondToRequest function: ${error.message}`
    );
    return res.json({
      success: false,
      message: `An error occured in respondToRequest function: ${error.message}`,
    });
  }
};

const getRequestsHistory = async (req, res) => {
  try {
    const payload = req.payload;

    const requests = await RequestCalendarHistory.find({
      changedBy: new mongoose.Types.ObjectId(payload.id),
    })
      .select("createdAt status")
      .populate([
        { path: "requestBy", select: "name email" },
        { path: "requestId", select: "message" },
      ]);

    if (!requests)
      return res.json({ success: false, message: "Something went wrong" });
    if (requests.length === 0)
      return res.json({ success: false, message: "No managed requests found" });

    console.log(requests);
    return res.json({
      success: true,
      message: "Managed requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.log(
      `An error occured in getRequestsHistory function: ${error.message}`
    );
    return res.json({
      success: true,
      message: `An error occured in getRequestsHistory function: ${error.message}`,
    });
  }
};

const revokeAccess = async (req, res) => {
  try {
    const { requestId } = req.body;
    const payload = req.payload;

    if (!requestId) {
      return res.json({ success: false, message: "Request ID is required" });
    }

    const request = await RequestCalendar.findById(requestId);
    if (!request) {
      return res.json({ success: false, message: "Request not found" });
    }

    if (request.status === "revoked") {
      return res.json({
        success: false,
        message: "Permission already revoked",
      });
    }

    const participant = await CalendarParticipants.findOne({
      email: request.requesterEmail,
    });

    if (!participant) {
      return res.json({ success: false, message: "Participant not found" });
    }

    await CalendarParticipants.deleteOne({
      email: request.requesterEmail,
      calendarId: participant.calendarId,
    });

    request.status = "revoked";
    await request.save();

    const calendar = await Calendar.findById(participant.calendarId);
    const requester = await User.findOne({ email: request.requesterEmail });

    if (calendar && requester) {
      sendNotificationToUsers(
        requester._id.toString(),
        calendar,
        payload.name,
        "removed"
      );
    }

    await RequestCalendarHistory.create({
      status: "revoked",
      changedBy: new mongoose.Types.ObjectId(payload.id),
      requestBy: new mongoose.Types.ObjectId(requester._id),
      changedAt: new Date(),
      requestId: request._id,
    });

    return res.json({ success: true, message: "Access revoked successfully" });
  } catch (error) {
    console.log(`Error in revokeAccess: ${error.message}`);
    return res.json({
      success: false,
      message: `Error in revokeAccess: ${error.message}`,
    });
  }
};

export {
  makeRequest,
  getRequests,
  respondToRequest,
  getRequestsHistory,
  revokeAccess,
};