import { Worker } from "bullmq";
import { sendEmail } from "../utils/email/email.js";
import { eventReminderTemplate } from "../utils/email/eventReminderTemplate.js";

const reminderWorker = new Worker(
  "event-reminders",
  async (job) => {
    try {
      const { title, start, end, location, organizerName, participants } =
        job.data;

      if (!participants || participants.length === 0) return;

      const htmlTemplate = eventReminderTemplate({
        title,
        start,
        end,
        location,
        organizerName,
      });

      console.log("Worker sending...");
      await Promise.all(
        participants.map((p) =>
          sendEmail(p.email, `Reminder: ${title} starts soon`, htmlTemplate)
        )
      );
      console.log("Worker sent");

      console.log(
        `Reminder emails sent for "${title}" (${participants.length})`
      );
    } catch (err) {
      console.error(`Job ${job.id} failed:`, err);
      throw err;
    }
  },
  {
    connection: { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" },
  }
);

reminderWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

reminderWorker.on("failed", (job, err) => {
  console.log(
    `Job ${job.id} failed for eventId=${job.data.eventId}: ${err.message}`
  );
});

export { reminderWorker };
