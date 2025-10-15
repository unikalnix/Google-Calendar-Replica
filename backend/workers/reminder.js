import express from "express";
import { sendEmail } from "../utils/email/email.js";
import { eventReminderTemplate } from "../utils/email/eventReminderTemplate.js";

const router = express.Router();

// Upstash QStash will POST here at the scheduled time
router.post("/worker", async (req, res) => {
  try {
    const { title, start, end, location, organizerName, participants } = req.body;

    if (!participants || participants.length === 0) {
      console.log(`No participants to remind for "${title}"`);
      return res.status(200).json({ message: "No participants" });
    }

    const html = eventReminderTemplate({
      title,
      start,
      end,
      location,
      organizerName,
    });

    console.log(`🔔 Sending reminders for "${title}"...`);
    await Promise.all(
      participants.map((p) =>
        sendEmail(p.email, `Reminder: ${title} starts soon`, html)
      )
    );

    console.log(`✅ Reminder emails sent to ${participants.length} participants`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Reminder worker failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
