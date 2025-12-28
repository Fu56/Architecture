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
    <div className="space-y-4">
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group flex items-start p-4 rounded-xl border transition-all duration-300 ${
                !notification.isRead
                  ? "bg-indigo-50/50 border-indigo-100 shadow-sm"
                  : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <NotificationIcon title={notification.title} />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p
                  className={`text-sm font-bold text-gray-900 ${
                    !notification.isRead ? "text-indigo-900" : ""
                  }`}
                >
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-400 font-medium">
                  <span>Today at 2:30 PM</span>{" "}
                  {/* Placeholder for timestamp */}
                </div>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="ml-4 flex-shrink-0 p-1.5 text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors text-xs font-bold shadow-sm"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-indigo-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Notifications</h3>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            You're all caught up!
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
