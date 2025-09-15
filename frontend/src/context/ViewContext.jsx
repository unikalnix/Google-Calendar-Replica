import React, { createContext, useContext, useState } from "react";
import { eventsData } from "../assets/data/events";

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const curr = new Date();
  const [currentYear, setCurrentYear] = useState(curr.getFullYear()); // number -> e.g., 2025
  const [currentMonth, setCurrentMonth] = useState(curr.getMonth()); // number (0-11) -> e.g., 8 for September
  const [currentDate, setCurrentDate] = useState(curr.getDate()); // number (1-31) -> e.g., 10

  // ---------------- Calendar & Time Functions ----------------
  // → returns 2D array of weeks, each week = [{ day: number, type: "prev"|"current"|"next" }]
  // Example for September 2025 →
  // [
  //   [ {day: 31, type:"prev"}, {day:1,type:"current"}, {day:2,type:"current"}, ... ],
  //   [ {day:7, type:"current"}, ... ],
  //   ...
  // ]
  const getCalendarData = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); //30, 31, 28, 29
    const firstDayIndex = new Date(year, month, 1).getDay(); // sunday = 0, monday = 1, tuesday = 2, ... friday = 6
    const prevMonthDays = new Date(year, month, 0).getDate(); //28, 29, 30, 31

    const calendar = [];
    let week = [];

    for (let i = firstDayIndex; i > 0; i--) {
      week.push({ day: prevMonthDays - i + 1, type: "prev" });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ day, type: "current" });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      for (let i = 1; week.length < 7; i++) {
        week.push({ day: i, type: "next" });
      }
      calendar.push(week);
    }

    return calendar;
  };

  // → ["00:00","01:00","02:00",...,"23:00"]
  const getTimeSlots = () =>
    Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  // → array of 7 Date objects (Sunday → Saturday) containing full week for that date
  // Example for Sept 10, 2025 → [Sun Sept 7, Mon Sept 8, ..., Sat Sept 13]
  const getWeekDates = (year, month, date) => {
    const baseDate = new Date(year, month, date);
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const currentFullDate = new Date(currentYear, currentMonth, currentDate);

  // ---------------- Navigation ----------------
  const goToPrevMonth = () =>
    setCurrentMonth((prev) =>
      prev === 0 ? (setCurrentYear((y) => y - 1), 11) : prev - 1
    );
  const goToNextMonth = () =>
    setCurrentMonth((prev) =>
      prev === 11 ? (setCurrentYear((y) => y + 1), 0) : prev + 1
    );
  const goToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setCurrentDate(now.getDate());
  };
  const goToPrevWeek = () => {
    const d = new Date(currentYear, currentMonth, currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setCurrentDate(d.getDate());
  };
  const goToNextWeek = () => {
    const d = new Date(currentYear, currentMonth, currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setCurrentDate(d.getDate());
  };
  const goToPrevDay = () => {
    const d = new Date(currentYear, currentMonth, currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setCurrentDate(d.getDate());
  };
  const goToNextDay = () => {
    const d = new Date(currentYear, currentMonth, currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setCurrentDate(d.getDate());
  };

  // ---------------- Event Helpers ----------------
  const getEventsByDate = (date) => {
    return eventsData.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const getEventsByWeek = (weekDates) => {
    return eventsData.filter((event) => {
      const eventDate = new Date(event.startDate);
      return weekDates.some(
        (d) =>
          d.getFullYear() === eventDate.getFullYear() &&
          d.getMonth() === eventDate.getMonth() &&
          d.getDate() === eventDate.getDate()
      );
    });
  };

  return (
    <ViewContext.Provider
      value={{
        currentYear,
        currentMonth,
        currentDate,
        currentFullDate,
        getCalendarData,
        getWeekDates,
        getTimeSlots,
        goToPrevMonth,
        goToNextMonth,
        goToToday,
        goToPrevWeek,
        goToNextWeek,
        goToPrevDay,
        goToNextDay,
        getEventsByDate,
        getEventsByWeek,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);
