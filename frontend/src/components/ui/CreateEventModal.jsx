
import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Repeat,
  Plus,
  ChevronDown,
  ExternalLink,
  Clock,
} from "lucide-react";

import { useEvent } from "../../context/EventContext";
import { useCalendar } from "../../context/CalendarContext";
import { useView } from "../../context/ViewContext";

const CreateEventModal = ({
  title: t,
  description: d,
  calendar: c,
  startTime: st,
  endTime: et,
  location: l,
  participants: p,
  repeat: rep,
  reminder: rem,
  updateEvent,
  eventId,
}) => {
  const { calendars, sharedWithMe, getSharedCalendars } = useCalendar();
  const [title, setTitle] = useState(t ?? "");
  const [description, setDescription] = useState(d ?? "");
  const [calendar, setCalendar] = useState("");

  function toDatetimeLocal(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  const [startTime, setStartTime] = useState(() =>
    st ? toDatetimeLocal(new Date(st)) : ""
  );
  const [endTime, setEndTime] = useState(() => {
    if (et) return toDatetimeLocal(new Date(et));
    if (st) {
      const end = new Date(st);
      end.setHours(end.getHours() + 1);
      return toDatetimeLocal(end);
    }
    return "";
  });
  const [location, setLocation] = useState(l ?? "");
  const [participants, setParticipants] = useState(p ?? []);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [repeat, setRepeat] = useState(rep ?? "none");
  const [reminder, setReminder] = useState(rem ?? 10);
  const [loading, setLoading] = useState(false);

  const {
    updateEventFunc,
    createNewEvent,
    successMessage,
    failureMessage,
    onClose,
    selectedDate,
  } = useEvent();
  const { currentFullDate } = useView();

  const handleAddParticipant = () => {
    if (!participantEmail) return;
    setParticipants([
      ...participants,
      { name: participantName, email: participantEmail },
    ]);
    setParticipantName("");
    setParticipantEmail("");
  };

  const getEventData = () => {
    const cal =
      calendars.find((c) => c.name === calendar) ||
      sharedWithMe.find((c) => c.name === calendar);

    return {
      title,
      description,
      calendarId: cal?._id ?? null,
      start: startTime ? new Date(startTime).toISOString() : null,
      end: endTime ? new Date(endTime).toISOString() : null,
      location,
      participants,
      repeat,
      reminderMinutes: reminder,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = getEventData();
    console.log("Submitting Event Data:", eventData); // Debug
    setLoading(true);
    if (updateEvent) await updateEventFunc(eventData, eventId);
    else await createNewEvent(eventData);
    setLoading(false);
  };

  useEffect(() => {
    if (c) {
      setCalendar(c);
    } else if (calendars.length > 0) {
      setCalendar(calendars[0].name);
    }
  }, [c, calendars]);

  useEffect(() => {
    if (selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(10, 0, 0, 0);

      setStartTime(toDatetimeLocal(start));
      setEndTime(toDatetimeLocal(end));
    }
  }, [selectedDate]);

  useEffect(() => {
    getSharedCalendars();
  }, [getSharedCalendars]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5" />
              <h2 className="text-lg font-semibold">
                Create New Event{" "}
                <span className="text-sm text-secondary cursor-pointer hover:underline ml-4">
                  See all events{" "}
                  <ExternalLink className="inline ml-1" width={15} />
                </span>
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentFullDate.toDateString()}
            </p>
          </div>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Meeting with team"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Add event details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendar
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                value={calendar || ""}
                onChange={(e) => setCalendar(e.target.value)}
              >
                {calendars.length > 0 && (
                  <optgroup label="My Calendars">
                    {calendars.map((cal) => (
                      <option key={cal._id} value={cal.name}>
                        {cal.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                {sharedWithMe.length > 0 && (
                  <optgroup label="Shared With Me">
                    {sharedWithMe.map((cal) => (
                      <option key={cal._id} value={cal.name}>
                        {cal.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                {!calendars.length && !sharedWithMe.length && (
                  <option value="">No calendars available</option>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" /> Start Time *
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" /> End Time *
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> Location
            </label>
            <input
              type="text"
              placeholder="e.g. Conference Room A, Zoom"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 inline mr-1" /> Participants
              </label>
              <span className="text-sm text-gray-500">
                {participants.length}
              </span>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Participant name (optional)"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email address *"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleAddParticipant}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Participant
              </button>
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Repeat className="w-4 h-4 inline mr-1" /> Repeat
            </label>
            <div className="relative">
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="none">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder
            </label>
            <div className="relative">
              <select
                value={reminder}
                onChange={(e) => setReminder(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value={10}>10 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>60 minutes before</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {}
          <div>
            {successMessage && (
              <p className="text-green-600 bg-green-100 border border-green-400 rounded px-3 py-2 text-sm font-medium">
                {successMessage}
              </p>
            )}
            {failureMessage && (
              <p className="text-red-600 bg-red-100 border border-red-400 rounded px-3 py-2 text-sm font-medium">
                {failureMessage}
              </p>
            )}
          </div>
        </div>

        {}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors cursor-pointer"
          >
            {loading
              ? updateEvent
                ? "Updating..."
                : "Creating..."
              : updateEvent
              ? "Update Event"
              : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
