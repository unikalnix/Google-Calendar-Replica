
import { Plus } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const MakeCalendarRequestModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [requestType, setRequestType] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");

  const { userEmail: requesterEmail, userName: requesterName } = useAuth();

  const handleSendRequest = async () => {
    if (!recipientEmail.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/makeRequest`,
        {
          recipientEmail,
          requesterEmail,
          requesterName,
          requestType,
          message,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuccessMessage(`Request sent to ${recipientEmail}`);
        setFailureMessage("");
        setRecipientEmail("");
        setRequestType("");
        setMessage("");
      } else {
        setFailureMessage(res.data.message || "Failed to send request");
        setSuccessMessage("");
      }
    } catch (error) {
      setFailureMessage("An error occurred while sending the request");
      setSuccessMessage("");
      console.error("handleSendRequest error:", error.message);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRecipientEmail("");
    setRequestType("");
    setMessage("");
    setSuccessMessage("");
    setFailureMessage("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Make Request
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Send Calendar Request
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter at least the recipient’s email. Other details are optional.
            </p>

            {}
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Recipient's email (user@example.com)"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {}
            <input
              type="text"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              placeholder="Request type (optional: view, edit)"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why do you need access? (optional)"
              rows="3"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            {(successMessage || failureMessage) && (
              <div className="mb-4">
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
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                disabled={!recipientEmail.trim()}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MakeCalendarRequestModal;
