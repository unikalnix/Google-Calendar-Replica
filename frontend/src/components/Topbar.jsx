import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Bell,
  Settings,
  User,
} from "lucide-react";
import useIsMobile from "../hooks/useIsMobile";
import { useView } from "../context/ViewContext";
import NotificationsModal from "../components/ui/NotificationsModal";
import { useState } from "react";
import CalendarCreationModal from "../components/ui/CalendarCreationModal";
import { useNotifications } from "../context/NotificationsContext";

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="p-2 bg-blue-600 rounded-lg">
      <Calendar className="w-5 h-5 text-white" />
    </div>
    <h1 className="text-xl font-bold text-gray-900">Calendar</h1>
  </div>
);

const NavigationControls = ({ isMobile }) => {
  const {
    currentYear,
    currentMonth,
    goToPrevMonth,
    goToNextMonth,
    goToToday, // ✅ use here
  } = useView();

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "en-US",
    {
      month: "long",
    }
  );

  return (
    <div className="flex items-center space-x-3">
      <button
        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        onClick={goToPrevMonth}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {!isMobile && (
        <button
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={goToToday} // ✅ reset to today
        >
          Today
        </button>
      )}

      <h1 className="text-lg font-semibold text-gray-900">
        {monthName} {currentYear}
      </h1>

      <button
        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        onClick={goToNextMonth}
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {isMobile && (
        <button
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={goToToday} // ✅ reset to today
        >
          Today
        </button>
      )}
    </div>
  );
};

const SearchBar = () => (
  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg min-w-0 flex-1 max-w-md">
    <Search className="w-4 h-4 text-gray-500 flex-shrink-0 cursor-text" />
    <input
      type="text"
      placeholder="Search events..."
      className="bg-transparent outline-none text-sm w-full min-w-0"
    />
  </div>
);

const ActionButtons = ({ isMobile, setIsOpen }) => {
  const [notiModal, setNotiModal] = useState(false);
  const {unreadLength} = useNotifications();

  return isMobile ? (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div
        className="cursor-pointer"
          onClick={() => {
            setNotiModal((prev) => !prev);
          }}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
            {unreadLength}
          </span>
        </div>
        {notiModal && (
          <div
            // onClick={() => {}} set unread true
            className="absolute right-0"
          >
            <NotificationsModal />
          </div>
        )}
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1 hover:bg-gray-100 rounded cursor-pointer"
      >
        <Plus className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  ) : (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create
      </button>
      <div className="relative select-none">
        <div
        className="cursor-pointer"
          onClick={() => {
            setNotiModal((prev) => !prev);
          }}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
            {unreadLength}
          </span>
        </div>
        {notiModal && (
          <div
            // onClick={() =>} set unread true
            className="absolute right-0"
          >
            <NotificationsModal />
          </div>
        )}
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
        <Settings className="w-5 h-5 text-gray-600" />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
        <User className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

const ViewTabs = ({ activeView, setActiveView }) => (
  <div className="flex space-x-1 mt-4 border-t border-gray-200 pt-4">
    <button
      onClick={() => setActiveView("month")}
      className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
        activeView === "month"
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      Month
    </button>
    <button
      onClick={() => setActiveView("week")}
      className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
        activeView === "week"
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      Week
    </button>
    <button
      onClick={() => setActiveView("day")}
      className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
        activeView === "day"
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      Day
    </button>
  </div>
);

const Topbar = ({ activeView, setActiveView, unreadLength }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {isMobile ? (
        <>
          {/* Mobile layout */}
          <div className="flex justify-between items-center mb-4">
            <Logo isMobile={true} />
            <ActionButtons
              unreadLength={unreadLength}
              isMobile={true}
              setIsOpen={setIsOpen}
            />
          </div>

          <div className="flex justify-center items-center mb-4">
            <NavigationControls isMobile={true} />
          </div>

          <SearchBar />
          <ViewTabs activeView={activeView} setActiveView={setActiveView} />
        </>
      ) : (
        <>
          {/* Desktop layout */}
          <div className="flex justify-between items-center mb-2">
            <Logo />
            <NavigationControls />
            <SearchBar />
            <ActionButtons setIsOpen={setIsOpen} unreadLength={unreadLength} />
          </div>

          <ViewTabs activeView={activeView} setActiveView={setActiveView} />
        </>
      )}

      {isOpen && (
        <CalendarCreationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Topbar;
