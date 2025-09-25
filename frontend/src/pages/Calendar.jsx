import axios from "axios";
import { ArrowLeft, Calendar1, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const { id: calendarId } = useParams();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [events, setEvents] = useState(null);
  const [role, setRole] = useState("");
  const [owner, setOwner] = useState("");

  const getCalendar = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/calendar/${
          type === "shared" ? "getSharedCalendar" : "getCalendar"
        }/${calendarId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        if (type !== "shared") {
          setName(res.data.name);
          setColor(res.data.color);
          setEvents(res.data.events);
          setRole("Owner");
        } else {
          const cal = res.data.calendar;
          setName(cal.name);
          setColor(cal.color);
          setEvents(cal.events);
          setRole(cal.role);
          setOwner(cal.owner.name);
        }
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCalendar();
  }, [calendarId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />

            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: color,
              }}
              className="w-6 h-6 rounded-full"
            ></div>
            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
              <Crown size={14} />
              <span>{role?.charAt(0).toUpperCase() + role?.slice(1)}</span>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Calendar Information
          </h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Owner
              </div>
              <div className="text-gray-900">{owner ? owner : "You"}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Total Events
              </div>
              <div className="text-gray-900">{events?.length} events</div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar1 size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          </div>

          {events?.length > 0 ? (
            <div className="space-y-3">
              {events
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((event) => {
                  const dateObj = new Date(event.startTime);

                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  const formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                  return (
                    <div
                      onClick={() =>
                        navigate(`/event/${calendarId}/${event._id}`)
                      }
                      key={event._id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div
                        style={{
                          backgroundColor: color,
                        }}
                        className={`w-3 h-3 rounded-full`}
                      ></div>

                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {event.description}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formattedDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formattedTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar1 size={48} className="text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500">No events in this calendar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;