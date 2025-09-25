import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { useCalendar } from "../../context/CalendarContext";

export default function CalendarCreationModal({ isOpen, onClose }) {
  const { getMyCalendars, getSharedCalendars } = useCalendar();
  const [calendarName, setCalendarName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [isShared, setIsShared] = useState(false);
  const [sharedEmails, setSharedEmails] = useState([
    { email: "", role: "viewer" },
  ]);
  const [autoRemove, setAutoRemove] = useState(false);
  const { setToast } = useToast();
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#8b5cf6", // Purple
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#84cc16", // Lime
  ];

  const handleAddEmail = () => {
    setSharedEmails([...sharedEmails, { email: "", role: "viewer" }]);
  };

  const handleRemoveEmail = (index) => {
    setSharedEmails(sharedEmails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index, value) => {
    const updated = [...sharedEmails];
    updated[index].email = value;
    setSharedEmails(updated);
  };

  const handleRoleChange = (index, value) => {
    const updated = [...sharedEmails];
    updated[index].role = value;
    setSharedEmails(updated);
  };

  const onCreateCalendar = async (calendarData) => {
    
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/calendar/create`,
        { calendarData },
        { withCredentials: true }
      );

      if (res.data.success) {
        setFailureMessage("");
        setSuccessMessage(res.data.message);
        getMyCalendars();
        getSharedCalendars();
        setCalendarName("");
        setSelectedColor("#3b82f6");
        setIsShared(false);
        setSharedEmails([{ email: "", role: "viewer" }]);
        setAutoRemove(false);
      } else {
        setSuccessMessage("");
        setFailureMessage(res.data.message);
      }
    } catch (error) {
      setToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const calendarData = {
      name: calendarName,
      color: selectedColor,
      isShared,
      sharedWith: isShared
        ? sharedEmails.filter((item) => item.email.trim() !== "")
        : [],
      autoRemove,
    };

    onCreateCalendar(calendarData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Calendar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="calendar-name"
              className="text-sm font-medium text-gray-700"
            >
              Calendar Name *
            </label>
            <input
              id="calendar-name"
              type="text"
              value={calendarName}
              onChange={(e) => setCalendarName(e.target.value)}
              placeholder="Enter calendar name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Calendar Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    selectedColor === color
                      ? "border-gray-400 scale-110"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Want to share this calendar?
              </label>
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {isShared && (
              <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                <label className="text-sm text-gray-600">
                  Share with users (email addresses)
                </label>
                {sharedEmails.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="email"
                      value={item.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <select
                      value={item.role}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="owner">Owner</option>
                    </select>
                    {sharedEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(index)}
                        className="px-2 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Add another email
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Auto-remove calendar when all events end?
                </label>
                <p className="text-xs text-gray-500">
                  Calendar will be automatically deleted once all events have
                  ended
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoRemove}
                onChange={(e) => setAutoRemove(e.target.checked)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            {successMessage && (
              <p className="text-green-600 bg-green-100 border border-green-400 rounded px-3 py-2 text-sm font-medium">
                {successMessage}
              </p>
            )}
            {failureMessage && (
              <p className="text-red-600 bg-red-100 border border-red-400 rounded px-3 py-2 text-sm font-medium">
                {failureMessage}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-50 cursor-pointer"
              disabled={!calendarName.trim() || loading}
            >
              {loading ? "Creating..." : "Create Calendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}