
import { Calendar, User, Clock, Check, X, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const CalendarSharingRequests = ({
  requests,
  reqHistory,
  setReqHistory,
  getReqHistory,
}) => {
  const [respondedRequests, setRespondedRequests] = useState({});
  const [pendingRequestsLength, setPendingRequestsLength] = useState(0);
  const [isRespond, setIsRespond] = useState(false);

  const getPendingRequests = () => {
    if (requests) {
      const filteredRequests = requests.filter(
        (r) => r.status === "pending" && !respondedRequests[r._id]
      );
      setPendingRequestsLength(filteredRequests.length);
    }
  };

  const respondToRequest = async (status, requestId, requesterEmail) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/respondToRequest`,
        { status, requestId, requesterEmail },
        { withCredentials: true }
      );
      if (res.data.success) {
        getReqHistory();
        setRespondedRequests((prev) => ({
          ...prev,
          [requestId]: status,
        }));
        setIsRespond(true);
        console.log(res.data.message);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(
        `An error occured in respondToRequest function: ${error.message}`
      );
    }
  };

  const handleRevokeAccess = async (requestId) => {
    setReqHistory((prev) =>
      prev.map((h) =>
        h.requestId?._id === requestId ? { ...h, status: "revoked" } : h
      )
    );

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/request/revokeAccess`,
        { requestId },
        { withCredentials: true }
      );

      if (res.data.success) {
        getReqHistory();
        console.log(res.data.message);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(
        `An error occurred in handleRevokeAccess function: ${error.message}`
      );
    }
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    getPendingRequests();
    setIsRespond(false);
  }, [isRespond]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Calendar Sharing Requests
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage who can access your calendar
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full sm:w-auto">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
      {}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Pending Requests
          </h2>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
            {pendingRequestsLength ?? 0}
          </span>
        </div>

        {requests &&
          requests.length > 0 &&
          requests
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .filter(
              (request) =>
                request.status === "pending" && !respondedRequests[request._id]
            )
            .map((request, index) => (
              <div key={index} className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base flex-shrink-0">
                        {getInitials(request.requesterName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">
                            {request.requesterName}
                          </h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                            {request.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 break-all">
                          {request.requesterEmail}
                        </p>
                        <p className="text-sm sm:text-base text-gray-800 mb-3">
                          {request.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          {formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-4">
                      <button
                        disabled={respondedRequests[request._id]}
                        onClick={() =>
                          respondToRequest(
                            "granted",
                            request._id,
                            request.requesterEmail
                          )
                        }
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base cursor-pointer
                          ${
                            respondedRequests[request._id] === "granted"
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                      >
                        <Check className="w-4 h-4" />
                        {respondedRequests[request._id] === "granted"
                          ? "Access Granted"
                          : "Grant Access"}
                      </button>

                      <button
                        disabled={respondedRequests[request._id]}
                        onClick={() =>
                          respondToRequest(
                            "revoked",
                            request._id,
                            request.requesterEmail
                          )
                        }
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base cursor-pointer
                          ${
                            respondedRequests[request._id] === "revoked"
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                      >
                        <X className="w-4 h-4" />
                        {respondedRequests[request._id] === "revoked"
                          ? "Access Denied"
                          : "Deny"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {}
      {requests &&
        requests.filter(
          (request) =>
            request.status === "pending" && !respondedRequests[request._id]
        ).length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No new requests
            </h3>
          </div>
        )}

      {}
      <div>
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
          Request History
        </h2>
        <div className="space-y-4">
          {reqHistory && reqHistory.length > 0 ? (
            reqHistory.map((history, idx) => (
              <div
                key={history._id || idx}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm sm:text-base flex-shrink-0">
                      {history.requestBy?.name ? (
                        history.requestBy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {history.requestBy?.name || "Unknown"}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            history.status === "granted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          } w-fit`}
                        >
                          {history.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 break-all">
                        {history.requestBy?.email || ""}
                      </p>
                      <p className="text-sm sm:text-base text-gray-800 mb-3">
                        {history.requestId?.message || ""}
                      </p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        {formatDistanceToNow(new Date(history.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto cursor-pointer"
                    onClick={() => handleRevokeAccess(history.requestId._id)}
                  >
                    <X className="w-4 h-4" />
                    Revoke Access
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No history yet
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSharingRequests;
