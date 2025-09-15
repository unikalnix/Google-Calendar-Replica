import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ViewProvider } from "./context/ViewContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import { CalendarProvider } from "./context/CalendarContext.jsx";
import { EventProvider } from "./context/EventContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationsProvider>
        <ToastProvider>
          <CalendarProvider>
            <EventProvider>
              <ViewProvider>
                <App />
              </ViewProvider>
            </EventProvider>
          </CalendarProvider>
        </ToastProvider>
      </NotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
);
