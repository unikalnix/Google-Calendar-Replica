import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [events, setEvents] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const createNewEvent = async (eventData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/create`,
        eventData,
        { withCredentials: true }
      );

      if (res.data.success) {
        setEvents((prev) => [...prev, res.data.event]);
        setFailureMessage("");
        setSuccessMessage(res.data.message);
      } else {
        setSuccessMessage("");
        setFailureMessage(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateEventFunc = async (eventData, eventId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/update/${eventId}`,
        eventData,
        { withCredentials: true }
      );

      if (res.data.success) {
        setFailureMessage("");
        setSuccessMessage(res.data.message);
      } else {
        setSuccessMessage("");
        setFailureMessage(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      setFailureMessage("Something went wrong while updating the event.");
    }
  };

  const fetchEvents = async (view, currentDate) => {
    let startDate, endDate;

    if (view === "month") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );
    } else if (view === "week") {
      const day = currentDate.getDay();
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - day);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (view === "day") {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      throw new Error("Invalid view type");
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/getEvents`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setEvents(res.data.events);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setFailureMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMessage, failureMessage]);

  return (
    <EventContext.Provider
      value={{
        isEventModalOpen,
        setIsEventModalOpen,
        onClose: () => setIsEventModalOpen(false),
        createNewEvent,
        updateEventFunc,
        events,
        successMessage,
        failureMessage,
        selectedDate,
        setSelectedDate,
        fetchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
