import { useState, useEffect, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";
import {
  Calendar,
  Home,
  Settings,
  Share2,
  Eye,
  ChevronUp,
  ChevronDown,
  Share2Icon,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCalendar } from "../context/CalendarContext";
import CalendarShareModal from "../components/ui/CalendarShareModal";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(null);
  const [calendarToBeShare, setCalendarToBeShare] = useState({});

  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [navigation, setNavigation] = useState("Calendar");
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { calendars, calErrMsg, sharedCalErrMsg, sharedWithMe, deleteCal } =
    useCalendar();

  const { userEmail } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile]);

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-full p-2 shadow-md"
        >
          {isOpen ? (
            <ChevronDown className="w-6 h-6 text-gray-700" />
          ) : (
            <ChevronUp className="w-6 h-6 text-gray-700" />
          )}
        </button>
      )}

      <div
        ref={sidebarRef}
        className={`${
          isMobile
            ? `fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 transform transition-transform duration-300 ${
                isOpen ? "translate-y-0" : "translate-y-full"
              }`
            : "w-80 bg-white border-r border-gray-200 p-6 flex flex-col"
        }`}
      >
        {}
        {!isMobile ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">
                My Calendars <span>({calendars.length})</span>
              </h1>
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:text-gray-900 font-medium cursor-pointer border-1 border-border px-3 py-2 rounded-md">
                  Agenda
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-around items-center mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center gap-1 p-2"
            >
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Home</span>
            </button>
            <button
              onClick={() => setNavigation("Calendar")}
              className={`flex flex-col items-center gap-1 p-2 ${
                navigation === "Calendar" && "text-blue-600"
              }`}
            >
              <Calendar
                className={`w-5 h-5 ${
                  navigation === "Calendar" && "text-blue-600"
                }`}
              />
              <span className="text-xs font-medium">Calendar</span>
            </button>
            <button
              onClick={() => setNavigation("Shared")}
              className={`flex flex-col items-center gap-1 p-2 ${
                navigation === "Shared" && "text-blue-600"
              }`}
            >
              <Share2
                className={`w-5 h-5 ${
                  navigation === "Shared" && "text-blue-600"
                }`}
              />
              <span className="text-xs font-medium">Shared</span>
            </button>
            <button
              onClick={() => setNavigation("Settings")}
              className={`flex flex-col items-center gap-1 p-2 ${
                navigation === "Settings" && "text-blue-600"
              }`}
            >
              <Settings
                className={`w-5 h-5 ${
                  navigation === "Settings" && "text-blue-600"
                }`}
              />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        )}

        {}
        {navigation === "Calendar" ? (
          <div
            className={
              isMobile
                ? "border-t border-gray-200 pt-4 h-[200px] overflow-y-scroll"
                : "h-1/3 overflow-y-scroll"
            }
          >
            {isMobile && (
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">My Calendars</h3>
                <button className="text-gray-600 hover:text-gray-900 font-medium cursor-pointer border-1 border-border px-3 py-2 rounded-md">
                  Agenda
                </button>
              </div>
            )}

            {calendars && calendars.length > 0 ? (
              calendars.map((cal, index) => (
                <div
                  key={cal._id || index}
                  className="flex justify-between py-3 px-2 rounded-lg hover:bg-hover group"
                >
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: cal?.color }}
                      ></div>
                      <label
                        htmlFor={`cal-${index}`}
                        className="text-sm text-gray-700"
                      >
                        {cal.name}
                      </label>
                      <ExternalLink
                        onClick={() => navigate(`/calendar/${cal._id}`)}
                        width={13}
                        className="ml-3 text-gray-600 hover:text-black cursor-pointer"
                      />
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      !isMobile
                        ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        : ""
                    }`}
                  >
                    <Share2Icon
                      onClick={() => {
                        setCalendarToBeShare(cal);
                        setIsShareModalOpen(true);
                      }}
                      width={15}
                      className="text-secondary cursor-pointer"
                    />

                    <Trash2
                      onClick={() => deleteCal(cal._id)}
                      width={15}
                      className="text-secondary cursor-pointer"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h1>{calErrMsg}</h1>
              </div>
            )}
          </div>
        ) : navigation === "Shared" ? (
          <div className="border-t border-gray-200 pt-4 h-[200px] overflow-y-scroll">
            {isMobile && (
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">
                  Shared Calendars
                </h3>
                <button className="text-gray-600 hover:text-gray-900 font-medium cursor-pointer border-1 border-border px-3 py-2 rounded-md">
                  Agenda
                </button>
              </div>
            )}

            {Array.isArray(sharedWithMe) &&
              sharedWithMe.length > 0 &&
              sharedWithMe.map((cal, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-3"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                        <label
                          htmlFor="shared-family"
                          className="text-sm text-gray-700"
                        >
                          {cal.name}
                        </label>
                        <ExternalLink
                          onClick={() =>
                            navigate(`/calendar/${cal._id}?type=shared`)
                          }
                          width={13}
                          className="ml-3 text-gray-600 hover:text-black cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {" "}
                      <Eye className="w-4 h-4 text-gray-400 cursor-pointer" />
                      <Trash2 onClick={() => deleteCal(cal._id)} className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                );
              })}

            {sharedWithMe && sharedWithMe.length === 0 && (
              <div>
                <h1>{sharedCalErrMsg}</h1>
              </div>
            )}
          </div>
        ) : navigation === "Settings" ? (
          <div className="border-t border-gray-200 pt-4 h-[200px] overflow-y-scroll">
            Settings
          </div>
        ) : null}

        {}
        {!isMobile && (
          <div className="mt-8 h-1/3 overflow-y-scroll">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Shared with me{" "}
              <span>
                ({Array.isArray(sharedWithMe) ? sharedWithMe.length : 0})
              </span>
            </h3>
            {}
            {Array.isArray(sharedWithMe) &&
              sharedWithMe.length > 0 &&
              sharedWithMe.map((cal, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center mb- py-3 px-2 rounded-lg hover:bg-hover"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                        <label
                          htmlFor="shared-family"
                          className="text-sm text-gray-700"
                        >
                          {cal.name}
                        </label>
                        <ExternalLink
                          onClick={() =>
                            navigate(`/calendar/${cal._id}?type=shared`)
                          }
                          width={13}
                          className="ml-3 text-gray-600 hover:text-black cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {" "}
                      <Eye className="w-4 h-4 text-gray-400 cursor-pointer" />
                      <Trash2 onClick={() => deleteCal(cal._id)} className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                );
              })}

            {sharedWithMe && sharedWithMe.length === 0 && (
              <div>
                <h1>{sharedCalErrMsg}</h1>
              </div>
            )}
          </div>
        )}
      </div>
      {isShareModalOpen && (
        <CalendarShareModal
          isShareModalOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          calendarToBeShare={calendarToBeShare}
        />
      )}
    </>
  );
};

export default Sidebar;
