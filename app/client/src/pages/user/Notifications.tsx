import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";
import type { Notification } from "../../models";
import { Bell, CheckCircle, XCircle, Info, Zap } from "lucide-react";

const NotificationIcon = ({ title }: { title: string }) => {
  const t = title.toLowerCase();
  if (t.includes("approved"))
    return <CheckCircle className="h-4 w-4 text-[#5A270F]" />;
  if (t.includes("rejected") || t.includes("denied"))
    return <XCircle className="h-4 w-4 text-rose-600" />;
  if (t.includes("assignment"))
    return <Zap className="h-4 w-4 text-[#DF8142]" />;
  return <Info className="h-4 w-4 text-[#92664A]" />;
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
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    try {
      await api.patch(`/notifications/${id}/read`);
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch {
      // Revert on error
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
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
          <div className="h-12 w-12 border-2 border-[#EEB38C]/20 border-t-[#DF8142] rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black text-[#92664A] uppercase tracking-[0.3em]">
          Retrieving Briefings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#5A270F] tracking-tighter uppercase mb-1">
            Intelligence Feed
          </h2>
          <p className="text-[10px] font-black text-[#92664A] uppercase tracking-[0.4em]">
            System Logistics & Performance Updates
          </p>
        </div>
        <div className="h-12 w-12 bg-[#FAF8F4] border border-[#EEB38C]/30 rounded-2xl flex items-center justify-center shadow-sm">
          <Bell className="h-5 w-5 text-[#DF8142]" />
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`group relative flex items-start p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer ${
                !notification.is_read
                  ? "bg-white border-[#EEB38C]/40 shadow-xl shadow-[#DF8142]/5 hover:shadow-2xl hover:shadow-[#DF8142]/10"
                  : "bg-[#FAF8F4] border-transparent opacity-80 hover:opacity-100 hover:bg-white hover:border-[#EEB38C]/30"
              }`}
            >
              {!notification.is_read && (
                <div className="absolute top-8 right-10 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />
                  <span className="text-[8px] font-black text-[#DF8142] uppercase tracking-widest">
                    Priority Intelligence
                  </span>
                </div>
              )}

              <div
                className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  !notification.is_read
                    ? "bg-[#DF8142] text-white shadow-lg shadow-[#DF8142]/20"
                    : "bg-[#6C3B1C]/5 text-[#92664A]"
                }`}
              >
                <NotificationIcon title={notification.title} />
              </div>

              <div className="ml-5 flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      !notification.is_read
                        ? "text-[#DF8142]"
                        : "text-[#92664A]"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <span className="text-[10px] font-black text-[#EEB38C] uppercase tracking-widest">
                    •{" "}
                    {new Date(notification.created_at).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <p
                  className={`text-sm mt-3 leading-relaxed whitespace-pre-wrap ${
                    !notification.is_read
                      ? "text-[#5A270F] font-bold"
                      : "text-[#92664A] font-medium"
                  }`}
                >
                  {notification.message}
                </p>

                <div className="mt-6 flex items-center gap-6 pt-6 border-t border-[#EEB38C]/10">
                  {notification.resource_id && (
                    <span className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.2em] hover:text-[#5A270F] transition-colors">
                      Inspect Resource Node →
                    </span>
                  )}
                  {notification.assignment_id && (
                    <span className="text-[10px] font-black text-[#DF8142] uppercase tracking-[0.2em] hover:text-[#5A270F] transition-colors">
                      View Assignment Brief →
                    </span>
                  )}
                  {!notification.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="text-[9px] font-black text-[#92664A] uppercase tracking-[0.3em] hover:text-[#DF8142] transition-colors ml-auto"
                    >
                      Acknowledge Intel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-[#FAF8F4] rounded-[4rem] border border-dashed border-[#EEB38C]/40">
          <div className="h-20 w-20 bg-white border border-[#EEB38C]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Bell className="h-10 w-10 text-[#EEB38C]/30" />
          </div>
          <h3 className="text-2xl font-black text-[#5A270F] tracking-tighter uppercase">
            Zero Delta Detected
          </h3>
          <p className="text-[10px] text-[#92664A] font-black uppercase tracking-[0.3em] mt-3">
            Intelligence feed is currently dormant.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
