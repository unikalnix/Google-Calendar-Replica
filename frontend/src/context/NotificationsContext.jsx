import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from "axios";

const NotificationsContext = createContext();
<<<<<<< HEAD
const socket = io("http://localhost:3000", { withCredentials: true });
=======
const socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true, path:"/gcrapp-socket" });
>>>>>>> 4206414 (Adding a calendar request feature via socket.io. Real time updation on frontend)

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationErr, setNotificationErr] = useState("");
  const { userId } = useAuth();
  const [unreadLength, setUnreadLength] = useState(0);

  const setUnreadToRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, unread: false } : n))
    );

    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/setStatus/${id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Error marking notification read:", error.message);
    }
  };

  const getAllNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/readAll`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const sorted = res.data.notifications.sort(
          (a, b) => b.unread - a.unread
        );
        setNotifications(sorted);
      } else {
        setNotificationErr(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  useEffect(() => {
    setUnreadLength(notifications.filter((n) => n.unread).length);
  }, [notifications]);

  useEffect(() => {}, [unreadLength]);

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
    }

    socket.on("notification", (data) => {
      setNotifications((prev) =>
        [data, ...prev].sort((a, b) => b.unread - a.unread)
      );
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        notificationErr,
        setNotificationErr,
        getAllNotifications,
        setUnreadToRead,
        unreadLength,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
