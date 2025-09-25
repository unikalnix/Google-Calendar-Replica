import { useEffect } from "react";
import { useView } from "../context/ViewContext";
import { useEvent } from "../context/EventContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WeekView = () => {
  const {
    currentYear,
    currentMonth,
    currentDate,
    getWeekDates,
    getTimeSlots,
    currentFullDate,
    goToPrevWeek,
    goToNextWeek,
  } = useView();
  const { fetchEvents, events } = useEvent();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDates = getWeekDates(currentYear, currentMonth, currentDate);
  const timeSlots = getTimeSlots();

  useEffect(() => {
    fetchEvents("week", currentFullDate);
  }, [currentFullDate]);

  const getEventsForCell = (date, hour) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime || event.startTime);

      const cellStart = new Date(date);
      cellStart.setHours(hour, 0, 0, 0);
      const cellEnd = new Date(date);
      cellEnd.setHours(hour + 1, 0, 0, 0);

      return eventStart < cellEnd && eventEnd >= cellStart;
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px] lg:min-w-full">
        {}
        <div className="flex items-center p-3 gap-10 bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex gap-3">
            <button
              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={goToPrevWeek}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={goToNextWeek}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="font-semibold text-gray-700">
            Week of {weekDates[0].toLocaleDateString()} -{" "}
            {weekDates[6].toLocaleDateString()}
          </div>
        </div>

        {}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-white sticky top-[40px] z-10">
          <div className="p-3 border-r border-gray-200"></div>
          {weekDates.map((date, index) => (
            <div
              key={index}
              className="p-3 text-center border-r border-gray-200 last:border-r-0"
            >
              <div className="text-sm font-medium text-gray-600 mb-1">
                {daysOfWeek[index]}
              </div>
              <div
                className={`text-lg font-semibold ${
                  date.toDateString() === new Date().toDateString()
                    ? "text-blue-600"
                    : "text-gray-900"
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="relative">
          {timeSlots.map((time, timeIndex) => (
            <div
              key={time}
              className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="p-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 font-medium">
                {time}
              </div>
              {weekDates.map((date, dayIndex) => {
                const hour = timeIndex;
                const cellEvents = getEventsForCell(date, hour);

                return (
                  <div
                    key={dayIndex}
                    className="h-20 border-r border-gray-100 last:border-r-0 relative p-1 flex flex-col overflow-auto"
                  >
                    {cellEvents.map((event) => (
                      <div
                        key={event._id}
                        className="text-white text-xs p-1 rounded bg-fill truncate mb-1"
                        style={{
                          minHeight: "16px",
                          backgroundColor: event.calendar.color,
                        }}
                      >
                        {event.title}
                        <div className="text-[10px] opacity-90">
                          {new Date(event.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;