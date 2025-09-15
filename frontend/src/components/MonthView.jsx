import { useView } from "../context/ViewContext";
import { useEvent } from "../context/EventContext";
import { useEffect } from "react";

const MonthView = () => {
  const {
    currentYear,
    currentMonth,
    getCalendarData,
    goToPrevMonth,
    goToNextMonth,
  } = useView();
  const calendarData = getCalendarData(currentYear, currentMonth);
  const { setIsEventModalOpen, setSelectedDate, fetchEvents, events } =
    useEvent();

  useEffect(() => {
    const currentDate = new Date(currentYear, currentMonth, 1);
    fetchEvents("month", currentDate);
  }, [currentYear, currentMonth]);

  return (
    <div className="flex-1 p-2 md:p-4 lg:p-6 bg-white overflow-auto">
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[700px] md:min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th
                  key={day}
                  className="p-2 md:p-3 lg:p-4 text-left text-xs md:text-sm font-medium text-gray-500 bg-gray-50 w-[100px] md:w-auto"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {calendarData.map((week, weekIndex) => (
              <tr
                key={weekIndex}
                className="border-b border-gray-100 last:border-b-0"
              >
                {week.map((dateObj, dayIndex) => {
                  
                  const cellDate = new Date(
                    currentYear,
                    currentMonth,
                    dateObj.day
                  );
                  cellDate.setHours(0, 0, 0, 0);

                  const handleClick = () => {
                    if (dateObj.type === "prev") {
                      goToPrevMonth();
                    } else if (dateObj.type === "next") {
                      goToNextMonth();
                    } else {
                      setSelectedDate(cellDate);
                      setIsEventModalOpen(true);
                    }
                  };
                  return (
                    <td
                      key={dayIndex}
                      className="p-0 align-top border-r border-gray-100 last:border-r-0 w-[60px] md:w-[100px] hover:bg-hover cursor-pointer"
                    >
                      <div
                        onClick={handleClick}
                        className="h-[100px] md:h-[120px] p-1 md:p-2 flex flex-col"
                      >
                        {}
                        <div
                          className={`text-xs md:text-sm font-medium mb-1 md:mb-2
                          ${
                            dateObj.type === "prev" || dateObj.type === "next"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }
                          ${
                            dateObj.day === new Date().getDate() &&
                            currentMonth === new Date().getMonth() &&
                            currentYear === new Date().getFullYear()
                              ? "bg-fill rounded-full px-2 py-0.5 w-fit text-white"
                              : ""
                          }
                          `}
                        >
                          {dateObj.day}
                        </div>

                        {}
                        <div className="flex-1 overflow-auto space-y-1">
                          {events &&
                            dateObj.type === "current" &&
                            events
                              .filter((event) => {
                                const eventDate = new Date(event.startTime);
                                eventDate.setHours(0, 0, 0, 0);
                                return (
                                  eventDate.getTime() === cellDate.getTime()
                                );
                              })
                              .map((event) => (
                                <div
                                style={{
                                   backgroundColor: event.calendar?.color || "#6b7280" 
                                }}
                                  key={event._id}
                                  className={`text-white text-xs p-1 rounded truncate`}
                                >
                                  {event.title}
                                </div>
                              ))}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthView;
