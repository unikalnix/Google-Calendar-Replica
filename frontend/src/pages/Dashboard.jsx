
import { useEffect, useState } from "react";
import MonthView from "../components/MonthView";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useIsMobile from "../hooks/useIsMobile";
import DayView from "../components/DayView";
import WeekView from "../components/WeekView";
import { useEvent } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import CreateEventModal from "../components/ui/CreateEventModal";
import { io } from "socket.io-client";

const Dashboard = ({
  requests,
  setRequests,
  getRequests,
}) => {
  const SOCKET = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    path: "gcrapp-socket",
  });
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState("month");
  const { isEventModalOpen, events } = useEvent();
  const { userId } = useAuth();
  const [calendarVisibility, setCalendarVisibility] = useState([]);

 useEffect(() => {
  if (events && events.length > 0) {
    const initialVisibility = events
      .map((e) => e?.calendar?._id) // safely access _id
      .filter((id) => id)            // remove undefined/null
      .map((id) => String(id));      // convert to string
    setCalendarVisibility(initialVisibility);
  }
}, [events]);

  useEffect(() => {
    if (userId) {
      SOCKET.emit("register", userId);
    }

    SOCKET.on("request", (data) => {
      setRequests((prev) =>
        [data, ...prev].sort((a, b) => b.isRead - a.isRead)
      );
    });

    return () => {
      SOCKET.off("request");
    };
  }, [userId]);

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={!isMobile ? "flex h-screen" : "flex flex-col h-screen"}>
        {!isMobile && (
          <Sidebar
            requests={requests}
            setCalendarVisibility={setCalendarVisibility}
          />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar activeView={activeView} setActiveView={setActiveView} />

          {activeView === "month" && (
            <MonthView calendarVisibility={calendarVisibility} />
          )}
          {activeView === "week" && <WeekView />}
          {activeView === "day" && <DayView />}
        </div>
        {isMobile && (
          <Sidebar
            requests={requests}
            setCalendarVisibility={setCalendarVisibility}
          />
        )}
      </div>

      {isEventModalOpen && <CreateEventModal />}
    </div>
  );
};

export default Dashboard;
