import { RequestCalendar } from "../../models/request/calendar.js";
import User from "../../models/user.js";
import validateEmail from "../../utils/emailValidator.js";
import { sendRequest } from "../../utils/notifications/calendarRequest.js";

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

    sendRequest(recipient._id, newRequest);
    return res.json({
      success: true,
      message: `Your request has been submitted to ${recipientEmail}`,
      newRequest,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: true,
      message: `An error occured in make request function: ${error.message}`,
    });
  }
};

export { makeRequest };
