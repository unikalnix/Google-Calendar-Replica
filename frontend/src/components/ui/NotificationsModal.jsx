import { useNotifications } from "../../context/NotificationsContext";

export default function NotificationsModal() {
  const { notifications, setUnreadToRead, unreadLength } = useNotifications();

  
  const formatDate = (utcDate) => {
    return new Date(utcDate).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
      {}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <p className="text-sm text-gray-500">{unreadLength} unread</p>
      </div>

      {}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              onClick={() => {
                if (notification.unread) {
                  setUnreadToRead(notification._id);
                }
              }}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notification.unread ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                {}
                {notification.unread && (
                  <div
                    style={{ backgroundColor: notification.color }}
                    className="w-2 h-2 rounded-full mt-2"
                  />
                )}

                {}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(notification.notifiedTime)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-gray-500">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}
