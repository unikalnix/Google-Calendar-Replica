import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Calendar from "./pages/Calendar";
import Event from "./pages/Event";
import CalendarSharingRequests from "./pages/CalendarSharingRequests";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <CalendarSharingRequests />
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
