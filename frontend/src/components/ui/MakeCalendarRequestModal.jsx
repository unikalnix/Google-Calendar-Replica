import { Plus } from "lucide-react";
import { useState } from "react";

const MakeCalendarRequestModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendRequest = () => {
    if (!email.trim()) return; // Prevent sending if email is empty

    // Simulate sending request to the entered email
    console.log(`Request sent to: ${email}`);
    setRequestSent(true);

    setTimeout(() => {
      setIsOpen(false);
      setRequestSent(false);
      setEmail("");
    }, 1500);
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
              Enter the email of the user whose calendar you want to access.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {requestSent ? (
              <p className="text-green-600 font-medium">
                Request Sent to {email} ✅
              </p>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setEmail("");
                  }}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  disabled={!email.trim()}
                >
                  Send Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MakeCalendarRequestModal;
