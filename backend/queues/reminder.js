import { Queue } from "bullmq";

const reminderQueue = new Queue("event-reminders", {
  connection: { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" },
});

async function scheduleReminderJob(event, organizerName) {
  if (!event.reminderMinutes || event.reminderMinutes <= 0) return;

  const reminderTime = new Date(event.startTime);
  reminderTime.setMinutes(reminderTime.getMinutes() - event.reminderMinutes);

  console.log("Reminder time\n", reminderTime);
  await reminderQueue.add(
    "sendReminderEmail",
    {
      eventId: event._id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      location: event.location,
      organizerName,
      participants: event.participants,
    },
    {
      delay: reminderTime.getTime() - Date.now(),
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 60 * 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}

export { scheduleReminderJob, reminderQueue };
