import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Repeat,
  Bell,
  User,
  Crown,
  Edit3,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useEvent } from "../context/EventContext";
import CreateEventModal from "../components/ui/CreateEventModal";

const Event = () => {
  const { calendarId, eventId } = useParams();
  const [eventData, setEventData] = useState(null);

  const navigate = useNavigate();
  const { setToast } = useToast();
  const { setIsEventModalOpen, isEventModalOpen } = useEvent();

  const getEvent = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/event/getEvent/${calendarId}/${eventId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setEventData(res.data.eventData);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteEvent = async () => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/event/deleteEvent/${calendarId}/${eventId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate(-1);
        setToast(res.data.message, "success");
      } else {
        setToast(res.data.message, "warning");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getEvent();
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Calendar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 size={16} />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={deleteEvent}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>

        {/* Event Title Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {eventData?.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {eventData?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date & Time Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={20} className="text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Date & Time
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Start Time
                </div>
                <div className="text-gray-900 font-medium">
                  {(() => {
                    const dateObj = new Date(eventData?.startTime);
                    return dateObj.toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  End Time
                </div>
                <div className="text-gray-900 font-medium">
                  {(() => {
                    const dateObj = new Date(eventData?.endTime);
                    return dateObj.toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Duration</span>
                <span className="text-sm font-medium text-gray-900">
                  {(() => {
                    const startTime = eventData?.startTime;
                    const endTime = eventData?.endTime;

                    const start = new Date(startTime);
                    const end = new Date(endTime);

                    const diffMs = end - start;
                    const diffMinutes = Math.floor(diffMs / 60000);
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;

                    const duration = `${hours}h ${minutes}min`;
                    return duration;
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={20} className="text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            </div>

            <div className="text-gray-900 font-medium">
              {eventData?.location}
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors">
              View on map →
            </button>
          </div>

          {/* Participants Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={20} className="text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Participants
              </h2>
              <span className="text-sm text-gray-500">
                ({eventData?.participants.length})
              </span>
            </div>

            <div className="space-y-3">
              {eventData?.participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {participant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={20} className="text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Repeat</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.repeat}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Reminder</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.reminderMinutes} minutes
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Calendar</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.calendar}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner & Metadata Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Event Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Owner
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {eventData?.owner
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {eventData?.owner}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Crown size={12} />
                    <span>Owner</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Created
              </div>
              <div className="text-gray-900">
                {(() => {
                  const dateObj = new Date(eventData?.createdAt);
                  return dateObj.toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                })()}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                Last Updated
              </div>
              <div className="text-gray-900">
                {(() => {
                  const dateObj = new Date(eventData?.updatedAt);
                  return dateObj.toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEventModalOpen && eventData && (
        <CreateEventModal
          title={eventData.title}
          description={eventData.description}
          calendar={eventData.calendar}
          startTime={eventData.startTime}
          endTime={eventData.endTime}
          location={eventData.location}
          participants={eventData.participants}
          repeat={eventData.repeat}
          reminder={eventData.reminderMinutes}
          updateEvent={true}
          eventId={eventId}
          calendarId={calendarId}
        />
      )}
    </div>
  );
};

export default Event;