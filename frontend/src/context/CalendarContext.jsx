import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  console.log("CalendarProvider mounted");
  const { setToast } = useToast();
  const [calendars, setCalendars] = useState([]);
  const [calErrMsg, setCalErrMsg] = useState("");
  const [sharedCalErrMsg, setSharedCalErrMsg] = useState("");
  const [sharedWithMe, setSharedWithMe] = useState([]);

  const getMyCalendars = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/calendar/getMyCalendars`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setCalendars(res.data?.calendars);
      } else {
        setCalErrMsg(res.data.message);
      }
    } catch (error) {
      setCalErrMsg(error.message);
    }
  };

  const getSharedCalendars = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/calendar/readAllShared`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setSharedWithMe(res.data.sharedWithMe);
      } else {
        setSharedCalErrMsg(res.data.message);
      }
    } catch (error) {
      setSharedCalErrMsg(error.message);
    }
  };

  const deleteCal = async (id, shared = false, role) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/calendar/deleteOne/${id}`,
        {shared, role},
        { withCredentials: true }
      );
      if (res.data.success) {
        setToast(res.data.message, "info");
        setCalendars((prev) => prev.filter((cal) => cal._id !== id));
        setSharedWithMe((prev) => prev.filter((cal) => cal._id !== id));
        getMyCalendars();
        getSharedCalendars();
      } else {
        setToast(res.data.message, "error");
      }
    } catch (error) {
      setToast(error.message, "error");
    }
  };

  useEffect(() => {
    getMyCalendars();
    getSharedCalendars();
  }, []);
  return (
    <CalendarContext.Provider
      value={{
        calendars,
        calErrMsg,
        sharedCalErrMsg,
        sharedWithMe,
        setSharedWithMe,
        getMyCalendars,
        getSharedCalendars,
        deleteCal,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);