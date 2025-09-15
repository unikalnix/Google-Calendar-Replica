import { useEffect } from "react";
import { useView } from "../context/ViewContext";
import { useEvent } from "../context/EventContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DayView = () => {
  const { currentFullDate, getTimeSlots, goToPrevDay, goToNextDay, goToToday } =
    useView();
  const { fetchEvents, events } = useEvent();

  const startHour = 0;
  const endHour = 23;
  const timeSlots = getTimeSlots().slice(startHour, endHour + 1);

  
  useEffect(() => {
    fetchEvents("day", currentFullDate);
  }, [currentFullDate]);

  
  const dayEvents = events.filter((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return (
      start.toDateString() === currentFullDate.toDateString() ||
      end.toDateString() === currentFullDate.toDateString() ||
      (start < currentFullDate && end > currentFullDate)
    );
  });

  const dayName = currentFullDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const fullDate = currentFullDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex-1 overflow-auto bg-white">
      {}
      <div className="flex items-center p-3 gap-10 bg-white border-b border-gray-200 sticky top-0 z-20">
       <div className="flex gap-3">
         <button
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
          onClick={goToPrevDay}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
          onClick={goToNextDay}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
       </div>
        <div className="mx-auto">
          <div className="text-sm text-gray-500 mb-1">{dayName}</div>
          <div className="text-2xl font-semibold text-blue-600">{fullDate}</div>
        </div>
        <div className="flex gap-2"></div>
      </div>

      {}
      <div className="relative">
        {timeSlots.map((time, timeIndex) => {
          const hour = timeIndex + startHour;

          
          const cellEvents = dayEvents.filter((event) => {
            const start = new Date(event.startTime);
            return (
              start.toDateString() === currentFullDate.toDateString() &&
              start.getHours() === hour
            );
          });

          return (
            <div
              key={time}
              className="flex border-b border-gray-100 hover:bg-gray-50 relative"
              style={{ minHeight: "64px" }}
            >
              {}
              <div className="w-20 p-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 font-medium flex-shrink-0">
                {time}
              </div>

              {}
              <div className="flex-1 relative p-1 overflow-auto">
                {cellEvents.map((event) => {
                  const start = new Date(event.startTime);
                  const end = new Date(event.endTime);

                  
                  const duration =
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                  return (
                    <div
                      key={event._id}
                      className="absolute left-1 right-1 text-white text-xs p-1 rounded shadow"
                      style={{
                        top: `${(start.getMinutes() / 60) * 100}%`,
                        height: `${duration * 100}%`,
                        backgroundColor: event.calendar.color
                      }}
                    >
                      {event.title}
                      <div className="text-[10px] opacity-80">
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
