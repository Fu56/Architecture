import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";
import type { Notification } from "../../models";
import {
  Bell,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  CheckCheck,
  ArrowUpRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────
   Icon + colour helper  
───────────────────────────────────────────────── */
const getIconMeta = (title: string, isRead: boolean) => {
  const t = title.toLowerCase();

  if (t.includes("approved"))
    return {
      Icon: CheckCircle,
      wrap: isRead ? "bg-[#92664A] text-white" : "bg-emerald-600 text-white",
    };
  if (t.includes("rejected") || t.includes("denied"))
    return {
      Icon: XCircle,
      wrap: isRead ? "bg-[#92664A] text-white" : "bg-rose-600 text-white",
    };
  if (t.includes("assignment"))
    return {
      Icon: Zap,
      wrap: isRead ? "bg-[#92664A] text-white" : "bg-[#DF8142] text-white",
    };
  return {
    Icon: Info,
    wrap: isRead ? "bg-[#92664A] text-white" : "bg-[#5A270F] text-white",
  };
};

interface SessionUser {
  role?: string | { name: string };
}

/* ─────────────────────────────────────────────────
   Component
───────────────────────────────────────────────── */
const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { data: session } = useSession();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* fetch ──────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/notifications");
        if (Array.isArray(data)) setNotifications(data);
      } catch {
        toast.error("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* actions ────────────────────────── */
  const markRead = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    try {
      await api.patch(`/notifications/${id}/read`);
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch {
      setNotifications((p) =>
        p.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );
    }
  };

  const markAllRead = async () => {
    setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => api.patch(`/notifications/${n.id}/read`)),
      );
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch {
      toast.error("Failed to mark all as read.");
    }
  };

  const handleClick = (n: Notification) => {
    if (!n.is_read) markRead(n.id);
    const user = session?.user as SessionUser | undefined;
    const role = typeof user?.role === "object" ? user.role.name : user?.role;
    const isAdmin = role === "Admin" || role === "SuperAdmin" || role === "admin";
    const base = isAdmin ? "/admin" : "/dashboard";
    if (n.resource_id) navigate(`${base}/resources/${n.resource_id}`);
    else if (n.assignment_id) navigate(`${base}/assignments/${n.assignment_id}`);
  };

  /* ── Loading ──────────────────────── */
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#EEB38C] opacity-20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#DF8142] animate-spin" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">
          Loading Signals...
        </p>
      </div>
    );
  }

  /* ── Main ─────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

        {/* Left: title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DF8142] bg-[#DF8142] text-white text-[10px] font-black uppercase tracking-[0.3em]">
            <Bell className="h-3 w-3" />
            Signal Feed
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter leading-none text-[#5A270F] dark:text-[#EEB38C]">
            Signals
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#6C3B1C] dark:text-[#EEB38C]">
            System updates &amp; activity alerts
          </p>
        </div>

        {/* Right: badge + actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {unreadCount > 0 && (
            <span className="px-4 py-2 rounded-xl bg-[#DF8142] text-white text-[11px] font-black uppercase tracking-widest shadow-lg">
              {unreadCount} Unread
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#5A270F] bg-white dark:bg-[#1A0B04] text-[#5A270F] dark:text-[#EEB38C] text-[11px] font-black uppercase tracking-widest hover:bg-[#5A270F] hover:text-white transition-all duration-200 shadow-sm"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
          )}
          <div className="relative h-12 w-12 rounded-2xl bg-[#5A270F] flex items-center justify-center shadow-xl">
            <Bell className="h-5 w-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#DF8142] border-2 border-white dark:border-[#0F0602] text-[9px] font-black text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-0.5 rounded-full bg-[#DF8142] opacity-30" />

      {/* ── List ── */}
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((n) => {
            const { Icon, wrap } = getIconMeta(n.title, n.is_read);
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`group relative flex items-start gap-5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  !n.is_read
                    ? "bg-[#FDFAF6] dark:bg-[#1A0B04] border-[#DF8142]/40 shadow-lg hover:shadow-xl hover:border-[#DF8142] border-l-4 border-l-[#DF8142]"
                    : "bg-[#FAF8F4] dark:bg-[#1A0B04] border-[#92664A]/30 hover:border-[#92664A]"
                }`}
              >
                {/* Unread badge */}
                {!n.is_read && (
                  <div className="absolute top-5 right-5 flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#DF8142] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#DF8142] hidden sm:block">
                      New
                    </span>
                  </div>
                )}

                {/* Icon box */}
                <div className={`flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md ${wrap}`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2 pr-16 sm:pr-24">

                  {/* Title row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[12px] font-black uppercase tracking-[0.15em] text-[#5A270F] dark:text-[#EEB38C]">
                      {n.title}
                    </span>
                    <span className="text-[11px] font-bold text-[#6C3B1C] dark:text-[#EEB38C] uppercase tracking-wider">
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Message — always fully visible */}
                  <p className="text-[14px] leading-relaxed text-[#5A270F] dark:text-[#EEB38C] font-medium whitespace-pre-wrap">
                    {n.message}
                  </p>

                  {/* Action links */}
                  {(n.resource_id || n.assignment_id || !n.is_read) && (
                    <div className="flex flex-wrap items-center gap-5 pt-4 mt-1 border-t-2 border-[#92664A]/30">
                      {n.resource_id && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-[#DF8142] hover:text-[#5A270F] dark:hover:text-white transition-colors underline underline-offset-4">
                          View Resource
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      )}
                      {n.assignment_id && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-[#DF8142] hover:text-[#5A270F] dark:hover:text-white transition-colors underline underline-offset-4">
                          View Assignment
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      )}
                      {!n.is_read && (
                        <button
                          onClick={(e) => markRead(n.id, e)}
                          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A270F] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#DF8142] transition-colors shadow-md"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark Read
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="py-28 text-center rounded-3xl border-2 border-dashed border-[#92664A] bg-white dark:bg-[#1A0B04]">
          <div className="h-24 w-24 mx-auto mb-8 rounded-3xl bg-[#EEB38C] flex items-center justify-center shadow-xl">
            <Bell className="h-12 w-12 text-[#5A270F]" />
          </div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#5A270F] dark:text-[#EEB38C] mb-3">
            All Clear
          </h3>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#6C3B1C] dark:text-[#EEB38C]">
            No notifications at this time
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
