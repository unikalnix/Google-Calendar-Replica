import { Queue } from "bullmq";
import { redisUrl } from "../config/redis.js"; 

const reminderQueue = new Queue("event-reminders", {
  connection: { url:redisUrl },
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