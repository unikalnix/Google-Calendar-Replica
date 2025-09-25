import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Calendar from "../components/MonthView";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useIsMobile from "../hooks/useIsMobile";
import DayCalendar from "../components/DayView";
import WeekCalendar from "../components/WeekView";
import { useToast } from "../context/ToastContext";
import { useEvent } from "../context/EventContext";
import axios from "axios";
import CreateEventModal from "../components/ui/CreateEventModal";
<<<<<<< HEAD

const Dashboard = () => {
  const { auth, setAuth } = useAuth();
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState("month");
  const { setToast } = useToast();
  const {isEventModalOpen} = useEvent();
=======
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
      const initialVisibility = events.map((e) => String(e.calendar._id));
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
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)

  useEffect(() => {}, [auth]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={!isMobile ? "flex h-screen" : "flex flex-col h-screen"}>
<<<<<<< HEAD
        {!isMobile && <Sidebar />}
=======
        {!isMobile && (
          <Sidebar
            requests={requests}
            setCalendarVisibility={setCalendarVisibility}
          />
        )}
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)

        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar activeView={activeView} setActiveView={setActiveView} />

          {activeView === "month" && <Calendar />}
          {activeView === "week" && <WeekCalendar />}
          {activeView === "day" && <DayCalendar />}
        </div>
<<<<<<< HEAD
        {isMobile && <Sidebar />}
=======
        {isMobile && (
          <Sidebar
            requests={requests}
            setCalendarVisibility={setCalendarVisibility}
          />
        )}
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)
      </div>
      <button
        className="px-2 py-2 border-1 border-black cursor-pointer"
        onClick={async () => {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,
              { withCredentials: true }
            );
            if (res.data.success) {
              setAuth(false);
            } else {
              setToast(res.data.message, "error");
            }
          } catch (error) {
            setToast(error.message);
          }
        }}
      >
        Logout
      </button>
      {isEventModalOpen && <CreateEventModal/>}
    </div>
  );
};

export default Dashboard;
