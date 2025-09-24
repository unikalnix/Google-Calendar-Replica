import { useState } from "react"
import { Calendar, User, Clock, Check, X, Settings } from "lucide-react"

const CalendarSharingRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      requesterName: "Sarah Johnson",
      requesterEmail: "sarah.johnson@company.com",
      requestType: "Calendar Access",
      message: "I want to share your calendar for project coordination",
      requestedAt: "2 hours ago",
      status: "pending",
      avatar: "SJ",
    },
    {
      id: 2,
      requesterName: "Mike Chen",
      requesterEmail: "mike.chen@company.com",
      requestType: "Calendar Access",
      message: "I want to share your calendar to schedule team meetings",
      requestedAt: "5 hours ago",
      status: "pending",
      avatar: "MC",
    },
    {
      id: 3,
      requesterName: "Emily Davis",
      requesterEmail: "emily.davis@company.com",
      requestType: "Calendar Access",
      message: "I want to share your calendar for client scheduling",
      requestedAt: "1 day ago",
      status: "granted",
      avatar: "ED",
    },
    {
      id: 4,
      requesterName: "Alex Rodriguez",
      requesterEmail: "alex.rodriguez@company.com",
      requestType: "Calendar Access",
      message: "I want to share your calendar for resource planning",
      requestedAt: "2 days ago",
      status: "revoked",
      avatar: "AR",
    },
    {
      id: 5,
      requesterName: "Lisa Wang",
      requesterEmail: "lisa.wang@company.com",
      requestType: "Calendar Access",
      message: "I want to share your calendar for deadline tracking",
      requestedAt: "3 days ago",
      status: "pending",
      avatar: "LW",
    },
  ])

  const handleGrantAccess = (requestId) => {
    setRequests(requests.map((request) => (request.id === requestId ? { ...request, status: "granted" } : request)))
  }

  const handleRevokeAccess = (requestId) => {
    setRequests(requests.map((request) => (request.id === requestId ? { ...request, status: "revoked" } : request)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "granted":
        return "bg-green-100 text-green-800"
      case "revoked":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const processedRequests = requests.filter((req) => req.status !== "pending")

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Calendar Sharing Requests</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage who can access your calendar</p>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full sm:w-auto">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Pending Requests</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {pendingRequests.length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm sm:text-base flex-shrink-0">
                      {request.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {request.requesterName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} w-fit`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 break-all">{request.requesterEmail}</p>
                      <p className="text-sm sm:text-base text-gray-800 mb-3">{request.message}</p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        {request.requestedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-4">
                    <button
                      onClick={() => handleGrantAccess(request.id)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Check className="w-4 h-4" />
                      Grant Access
                    </button>
                    <button
                      onClick={() => handleRevokeAccess(request.id)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" />
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests Section */}
      {processedRequests.length > 0 && (
        <div>
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Request History</h2>

          <div className="space-y-4">
            {processedRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm sm:text-base flex-shrink-0">
                      {request.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {request.requesterName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} w-fit`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 break-all">{request.requesterEmail}</p>
                      <p className="text-sm sm:text-base text-gray-800 mb-3">{request.message}</p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        {request.requestedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    {request.status === "granted" ? (
                      <button
                        onClick={() => handleRevokeAccess(request.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
                      >
                        <X className="w-4 h-4" />
                        Revoke Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGrantAccess(request.id)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
                      >
                        <Check className="w-4 h-4" />
                        Grant Access
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No sharing requests</h3>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            When someone requests access to your calendar, it will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default CalendarSharingRequests
