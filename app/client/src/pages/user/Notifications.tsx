import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Notification } from "../../models";
import { Loader2, Bell, CheckCircle, XCircle } from "lucide-react";

const NotificationIcon = ({ title }: { title: string }) => {
  if (title.toLowerCase().includes("approved")) {
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  }
  if (title.toLowerCase().includes("rejected")) {
    return <XCircle className="h-6 w-6 text-red-500" />;
  }
  return <Bell className="h-6 w-6 text-gray-500" />;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/user/notifications");
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    // Optimistic update
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await api.patch(`/user/notifications/${id}/read`);
    } catch {
      // Revert on error
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      console.error("Failed to mark notification as read");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flow-root">
      {notifications.length > 0 ? (
        <ul className="-my-4 divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center py-4 space-x-4"
            >
              <div className="flex-shrink-0">
                <NotificationIcon title={notification.title} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium text-gray-900 truncate ${
                    !notification.isRead && "font-bold"
                  }`}
                >
                  {notification.title}
                </p>
                <p className="text-sm text-gray-500">{notification.message}</p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">
            No Notifications
          </h3>
          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
