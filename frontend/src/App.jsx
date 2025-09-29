import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Calendar from "./pages/Calendar";
import Event from "./pages/Event";
import CalendarSharingRequests from "./pages/CalendarSharingRequests";
import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [requests, setRequests] = useState([]);
  const [reqHistory, setReqHistory] = useState([]);

  const getRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/getRequests`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setRequests(res.data.requests.sort((a, b) => b.isRead - a.isRead));
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(`An error occured in getRequests function: ${error.message}`);
    }
  };

  const getReqHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/getRequestsHistory`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setReqHistory(
          res.data.requests.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(`An error occured in getRequests function: ${error.message}`);
    }
  };

  useEffect(() => {
    getRequests();
    getReqHistory();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                requests={requests}
                setRequests={setRequests}
                getRequests={getRequests}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <CalendarSharingRequests
                requests={requests}
                reqHistory={reqHistory}
                setReqHistory={setReqHistory}
                getReqHistory={getReqHistory}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/calendar/:id" element={<Calendar />} />
        <Route path="/event/:calendarId/:eventId" element={<Event />} />
      </Routes>
    </div>
  );
};

export default App;
