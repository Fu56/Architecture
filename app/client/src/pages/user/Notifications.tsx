import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "react-toastify";
import { useSession } from "../../lib/auth-client";
import type { Notification } from "../../models";
import { Bell, CheckCircle, XCircle, Info, Zap } from "lucide-react";

const NotificationIcon = ({ title }: { title: string }) => {
  const t = title.toLowerCase();
  if (t.includes("approved"))
    return <CheckCircle className="h-4 w-4 text-emerald-500" />;
  if (t.includes("rejected") || t.includes("denied"))
    return <XCircle className="h-4 w-4 text-rose-500" />;
  if (t.includes("assignment"))
    return <Zap className="h-4 w-4 text-amber-500" />;
  return <Info className="h-4 w-4 text-indigo-500" />;
};

interface SessionUser {
  role?: string | { name: string };
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/notifications");
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch notifications:", err);
        toast.error("Failed to synchronize intelligence feed.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Optimistic update
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await api.patch(`/notifications/${id}/read`);
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch {
      // Revert on error
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    const user = session?.user as SessionUser | undefined;
    const role = typeof user?.role === "object" ? user.role.name : user?.role;
    const isAdmin =
      role === "Admin" || role === "SuperAdmin" || role === "admin";
    const basePrefix = isAdmin ? "/admin" : "/dashboard";

    if (notification.resource_id) {
      navigate(`${basePrefix}/resources/${notification.resource_id}`);
    } else if (notification.assignment_id) {
      navigate(`${basePrefix}/assignments/${notification.assignment_id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="relative">
          <div className="h-12 w-12 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Retrieving Briefings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-950 tracking-tight">
            Intelligence Feed
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            System Logistics & Updates
          </p>
        </div>
        <Bell className="h-5 w-5 text-slate-200" />
      </div>

      {notifications.length > 0 ? (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`group relative flex items-start p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer ${
                !notification.is_read
                  ? "bg-white border-indigo-100 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.1)]"
                  : "bg-slate-50/50 border-transparent opacity-80 hover:opacity-100 hover:bg-white hover:border-slate-100"
              }`}
            >
              {!notification.is_read && (
                <div className="absolute top-6 right-8 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">
                    New Priority
                  </span>
                </div>
              )}

              <div
                className={`flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${
                  !notification.is_read
                    ? "bg-indigo-600 shadow-lg shadow-indigo-600/20"
                    : "bg-slate-200"
                }`}
              >
                <NotificationIcon title={notification.title} />
              </div>

              <div className="ml-5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p
                    className={`text-xs font-black uppercase tracking-widest ${
                      !notification.is_read
                        ? "text-indigo-600"
                        : "text-slate-400"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <span className="text-[10px] font-bold text-slate-300">
                    {new Date(notification.created_at).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 leading-relaxed whitespace-pre-wrap ${
                    !notification.is_read
                      ? "text-slate-700 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  {notification.message}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  {notification.resource_id && (
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                      Inspect Resource →
                    </span>
                  )}
                  {notification.assignment_id && (
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                      View Assignment →
                    </span>
                  )}
                  {!notification.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Bell className="h-8 w-8 text-slate-100" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Zero Delta Detected
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-2">
            Intelligence feed is currently dormant.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
