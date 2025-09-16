import axios from "axios";
import { Copy, X, Users, Share2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useCalendar } from "../../context/CalendarContext";

function CalendarShareModal({
  calendarToBeShare: cal,
  isShareModalOpen,
  onClose,
}) {
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [updatedRole, setUpdatedRole] = useState(null);
  const [id, setId] = useState("");
  const { setToast } = useToast();
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [calendar, setCalendar] = useState(cal);
  const { getSharedCalendars } = useCalendar();
  const getParticipants = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/calendar/getParticipants/${cal._id.toString()}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setParticipants(res.data.participants);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      setToast(error.message, "error");
    }
  };

  useEffect(() => {
    getParticipants();
  }, [isShareModalOpen]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/calendar/share/${cal._id}`,
        {
          email,
          role,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setFailureMessage("");
        setSuccessMessage(res.data.message);
        getParticipants();
        getSharedCalendars();
        setCalendar((prev) => ({
          ...prev,
          sharedWith: [...prev.sharedWith, { email, role }],
        }));
        setEmail("");
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

  const updateRole = async (id) => {
    if (!id || !updatedRole) return;
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/calendar/updateRole?role=${updatedRole}`,
        { id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setFailureMessage("");
        setSuccessMessage(res.data.message);
        setCalendar((prev) => ({
          ...prev,
          sharedWith: prev.sharedWith.map((u) =>
            u._id === id ? { ...u, role: updatedRole } : u
          ),
        }));
      } else {
        setSuccessMessage("");
        setFailureMessage(res.data.message);
      }
    } catch (error) {
      setToast(error.message, "error");
    }
  };

  const deleteParticipant = async (pEmail, cid) => {
    // participant email, calendar id
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/calendar/deleteParticipant/${cid}`,
        { withCredentials: true, data: { pEmail } }
      );

      if (res.data.success) {
        setFailureMessage("");
        setSuccessMessage(res.data.message);
        getParticipants();
        setCalendar((prev) => ({
          ...prev,
          sharedWith: prev.sharedWith.filter((u) => u.email !== pEmail),
        }));
        getSharedCalendars();
      } else {
        console.log(res.data);
        setSuccessMessage("");
        setFailureMessage(res.data.message);
      }
    } catch (error) {
      setToast(error.message, "error");
    }
  };

  useEffect(() => {
    updateRole(id);
  }, [updatedRole, id]);

  useEffect(() => {}, [cal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setFailureMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/15" />

      {/* Modal */}
      <div className="relative z-50 bg-white rounded-lg shadow-lg border sm:max-w-lg w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Share "{cal.name}"</h2>
          </div>
          <button
            onClick={() => onClose()}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
  
          {/* Invite */}
          <div className="mt-5">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Invite people
            </h3>

            <form onSubmit={onSubmitHandler} className="relative flex gap-2">
              <input
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-10 rounded-md border px-3 py-2 text-sm"
              />
              <select
                required
                defaultValue="viewer"
                onChange={(e) => setRole(e.target.value)}
                className="p-2 outline-none border-1 border-primary rounded-md cursor-pointer"
              >
                <option
                  className="cursor-pointer p-2 border-1 outline-none rounded-md border-b-primary"
                  value="viewer"
                >
                  Viewer
                </option>
                <option
                  className="cursor-pointer p-2 border-1 outline-none rounded-md border-b-primary"
                  value="owner"
                >
                  Owner
                </option>
                <option
                  className="cursor-pointer p-2 border-1 outline-none rounded-md border-b-primary"
                  value="editor"
                >
                  Editor
                </option>
              </select>
              <button
                disabled={loading}
                value="submit"
                className="h-10 px-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                {loading ? "..." : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>

          {/* Request Resolve Message */}
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

          {/* People */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" /> People with access{" "}
              {cal.sharedWith.length}
            </h3>

            {/* Current user */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">
                  Y
                </div>
                <div>
                  <p className="text-sm font-medium">You</p>
                  <p className="text-xs text-gray-500">{cal.owner}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                👑 Owner
              </span>
            </div>

            {/* Other users */}
            {calendar.sharedWith.length > 0 &&
              calendar.sharedWith.map((s) => (
                <div
                  key={s.email}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                      {
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                          {(() => {
                            const name =
                              participants.find((f) => f.email === s.email)
                                ?.name || "";
                            return name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase();
                          })()}
                        </div>
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {participants.find((f) => f.email === s.email)?.name ||
                          " "}
                      </p>

                      <p className="text-xs text-gray-500">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        setUpdatedRole(e.target.value);
                        setId(s._id.toString());
                      }}
                      defaultValue={s.role}
                      className="px-2 py-1 outline-none border-1 border-primary rounded-md cursor-pointer"
                    >
                      <option
                        className="cursor-pointer p-2 border-1 outline-none rounded-md border-b-primary"
                        value="owner"
                      >
                        Owner
                      </option>
                      <option
                        className="cursor-pointer p-2 border-1 outline-none rounded-md border-b-primary"
                        value="viewer"
                      >
                        Viewer
                      </option>
                      <option
                        className="cursor-pointer p-2 border-1 outline-none rounded-md border-b-primary"
                        value="editor"
                      >
                        Editor
                      </option>
                    </select>
                    <button
                      onClick={() => {
                        deleteParticipant(s.email, cal._id.toString()); //participant email, calendar id
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarShareModal;
