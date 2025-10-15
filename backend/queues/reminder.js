import { qstash } from "../config/qstash.js";

export async function scheduleReminderJob(event, organizerName) {
  try {
    if (!event.reminderMinutes || event.reminderMinutes <= 0) {
      console.log(`No reminder set for event "${event.title}"`);
      return;
    }

    const reminderTime = new Date(event.startTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - event.reminderMinutes);

    const delayMs = reminderTime.getTime() - Date.now();
    if (delayMs <= 0) {
      console.log(`Reminder time already passed for "${event.title}"`);
      return;
    }

    const workerUrl = `${process.env.VITE_SERVER_URL}/api/reminder/worker`;
    const notBefore = Math.floor(reminderTime.getTime() / 1000);

    await qstash.publishJSON({
      url: workerUrl,
      notBefore,
      body: {
        eventId: event._id,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        location: event.location,
        organizerName,
        participants: event.participants || [],
      },
    });

    console.log(`QStash reminder scheduled for "${event.title}" at ${reminderTime}`);
  } catch (error) {
    console.error("Failed to schedule QStash job:", error.message);
  }
}
