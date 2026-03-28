import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Info,
  Loader2,
  Megaphone,
  Zap,
  Clock,
  X,
  Radio,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  source?: string;
  isEvent: boolean;
  eventDate: string | null;
  createdAt: string;
}

const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-[0.08em] mt-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
        <AlertCircle className="h-3 w-3 shrink-0" />
        {message}
      </p>
    );
  };

  const inputBase =
    "w-full bg-[#FAF8F4] dark:bg-[#0F0602] border border-[#BCAF9C]/40 dark:border-[#5A270F]/60 rounded-xl px-4 text-[#5A270F] dark:text-[#EEB38C] font-semibold text-xs outline-none transition-all duration-300 focus:border-[#DF8142] focus:ring-2 focus:ring-[#DF8142]/15 dark:focus:ring-[#DF8142]/10 placeholder:text-[#92664A]/40 dark:placeholder:text-[#EEB38C]/20";

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/common/news");
      setNews(res.data);
    } catch {
      toast.error("Protocol Error: Failed to synchronize announcement feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Headline is required.";
    if (!content.trim()) newErrors.content = "Message body is required.";
    if (isEvent && !eventDate) newErrors.eventDate = "Event date is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setProcessing(true);
    try {
      await api.post("/admin/news", {
        title,
        content,
        isEvent,
        eventDate: isEvent ? eventDate : null,
      });
      toast.success("Broadcast transmitted successfully");
      setShowForm(false);
      setTitle("");
      setContent("");
      setIsEvent(false);
      setEventDate("");
      setErrors({});
      fetchNews();
    } catch {
      toast.error("Protocol Breach: Broadcast release failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Terminate this announcement node?")) return;
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success("Announcement terminated");
      fetchNews();
    } catch {
      toast.error("Failed to terminate node");
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-12 w-12 border-2 border-[#EEB38C]/20 border-t-[#DF8142] rounded-full animate-spin" />
          <Loader2 className="h-5 w-5 text-[#DF8142] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em]">
          Synchronizing Feed...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-700">
      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5A270F] to-[#3D1A0A] dark:from-[#1A0B04] dark:to-black border border-[#6C3B1C]/40 dark:border-white/5 px-6 py-4 shadow-lg shadow-[#5A270F]/15">
        <div className="absolute top-0 right-0 w-48 h-full bg-[#DF8142]/10 blur-[50px] pointer-events-none" />
        <div className="absolute inset-0 architectural-dot-grid opacity-[0.04] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center shadow-md">
              <Megaphone className="h-4 w-4 text-[#DF8142]" />
            </div>
            <div>
              <p className="text-[8px] font-black text-[#EEB38C]/60 uppercase tracking-[0.4em] leading-none mb-0.5">
                Admin Broadcast
              </p>
              <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-none">
                News & <span className="text-[#DF8142]">Events</span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setErrors({});
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
              showForm
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-[#DF8142] border-[#DF8142] text-white hover:bg-[#EEB38C] hover:border-[#EEB38C] shadow-lg shadow-[#DF8142]/30"
            }`}
          >
            {showForm ? (
              <>
                <X className="h-3.5 w-3.5" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Initialize Broadcast
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Broadcast Form ── */}
      {showForm && (
        <div className="bg-white dark:bg-[#0F0602] rounded-2xl border border-[#BCAF9C]/30 dark:border-[#5A270F]/50 shadow-xl shadow-[#5A270F]/5 dark:shadow-none overflow-hidden animate-in slide-in-from-top-3 fade-in duration-300">
          {/* Form header stripe */}
          <div className="flex items-center gap-3 px-6 py-3 bg-[#FAF8F4] dark:bg-[#1A0B04] border-b border-[#BCAF9C]/20 dark:border-[#5A270F]/40">
            <Radio className="h-3.5 w-3.5 text-[#DF8142] animate-pulse" />
            <p className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C]/60 uppercase tracking-[0.3em]">
              Initialize Transmission
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-[#92664A] dark:text-[#EEB38C]/50">
                    News and Events Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                    }}
                    placeholder="Announcement title..."
                    className={`${inputBase} h-10 ${errors.title ? "border-rose-400 dark:border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/15" : ""}`}
                  />
                  <FieldError message={errors.title} />
                </div>

                {/* Event toggle */}
                <div className="rounded-xl border border-[#BCAF9C]/30 dark:border-[#5A270F]/50 bg-[#FAF8F4] dark:bg-[#1A0B04] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <h4 className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.15em]">
                        Temporal Event
                      </h4>
                      <p className="text-[7.5px] text-[#92664A] dark:text-[#EEB38C]/40 font-semibold uppercase tracking-wider mt-0.5">
                        Toggle to schedule an event
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Toggle Event Mode"
                      onClick={() => setIsEvent(!isEvent)}
                      className={`relative w-10 h-5 rounded-full transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-[#DF8142]/30 ${
                        isEvent
                          ? "bg-[#DF8142]"
                          : "bg-[#BCAF9C]/40 dark:bg-[#5A270F]/60"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                          isEvent ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {isEvent && (
                    <div className="px-4 pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-[#BCAF9C]/20 dark:border-[#5A270F]/40">
                      <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40 mb-1.5 mt-2">
                        Timeline Marker *
                      </label>
                      <input
                        id="eventDate"
                        type="datetime-local"
                        title="Event Date & Time"
                        value={eventDate}
                        onChange={(e) => {
                          setEventDate(e.target.value);
                          if (errors.eventDate)
                            setErrors((p) => ({ ...p, eventDate: "" }));
                        }}
                        className={`${inputBase} h-10 ${errors.eventDate ? "border-rose-400 dark:border-rose-500/60" : ""}`}
                      />
                      <FieldError message={errors.eventDate} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column — Content */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-[#92664A] dark:text-[#EEB38C]/50">
                  News and Events Content *
                </label>
                <textarea
                  rows={7}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content)
                      setErrors((p) => ({ ...p, content: "" }));
                  }}
                  placeholder="Write the announcement content..."
                  className={`${inputBase} py-3 resize-none ${errors.content ? "border-rose-400 dark:border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/15" : ""}`}
                />
                <FieldError message={errors.content} />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-[#BCAF9C]/20 dark:border-[#5A270F]/30">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2.5 px-6 py-2.5 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] dark:hover:bg-[#EEB38C] transition-all shadow-lg shadow-[#5A270F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    Release Announcement
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Archive Feed ── */}
      <div className="space-y-3">
        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0F0602] rounded-2xl border border-dashed border-[#BCAF9C]/30 dark:border-[#5A270F]/40">
            <div className="relative mb-5">
              <div className="h-14 w-14 bg-[#EEB38C]/10 dark:bg-[#5A270F]/30 rounded-2xl flex items-center justify-center">
                <Info className="h-7 w-7 text-[#EEB38C]/50 dark:text-[#EEB38C]/30" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 bg-[#DF8142] rounded-lg flex items-center justify-center text-white shadow-md">
                <Zap className="h-3 w-3" />
              </div>
            </div>
            <h3 className="text-base font-black text-[#5A270F] dark:text-[#EEB38C]/60 tracking-tighter uppercase italic mb-1">
              Awaiting <span className="text-[#DF8142] not-italic">Signal</span>
            </h3>
            <p className="text-[8.5px] text-[#92664A] dark:text-[#EEB38C]/30 font-semibold uppercase tracking-[0.2em] text-center max-w-[220px] leading-relaxed">
              No broadcasts yet. Initialize a new transmission to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-[#0F0602] rounded-xl border border-[#BCAF9C]/25 dark:border-[#5A270F]/40 hover:border-[#DF8142]/40 dark:hover:border-[#DF8142]/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${item.isEvent ? "bg-[#DF8142]" : "bg-[#5A270F]"}`}
                />

                <div className="pl-5 pr-4 py-4 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.isEvent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#DF8142]/10 dark:bg-[#DF8142]/20 text-[#DF8142] border border-[#DF8142]/20 text-[7px] font-black uppercase tracking-[0.15em] rounded-md">
                          <Calendar className="h-2.5 w-2.5" /> Event
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#5A270F]/10 dark:bg-[#5A270F]/30 text-[#5A270F] dark:text-[#EEB38C] border border-[#5A270F]/15 dark:border-[#EEB38C]/10 text-[7px] font-black uppercase tracking-[0.15em] rounded-md">
                          <Sparkles className="h-2.5 w-2.5" /> News
                        </span>
                      )}
                      <span className="text-[7.5px] font-semibold text-[#92664A] dark:text-[#EEB38C]/30 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(item.createdAt).toLocaleDateString(
                          undefined,
                          { dateStyle: "medium" },
                        )}
                      </span>
                      {item.source && (
                        <span className="text-[7px] font-black text-[#DF8142] uppercase tracking-widest px-1.5 py-0.5 bg-[#DF8142]/5 border border-[#DF8142]/10 rounded">
                          {item.source}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-tight uppercase">
                      {item.title}
                    </h4>

                    {/* Body */}
                    <p className="text-[11px] text-[#6C3B1C] dark:text-[#EEB38C]/60 font-medium leading-relaxed line-clamp-2">
                      {item.content}
                    </p>

                    {/* Event date badge */}
                    {item.isEvent && item.eventDate && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DF8142]/8 dark:bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-lg">
                        <AlertCircle className="h-3 w-3 text-[#DF8142]" />
                        <span className="text-[9px] font-black text-[#6C3B1C] dark:text-[#EEB38C]/70 uppercase tracking-wider">
                          {new Date(item.eventDate).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Terminate Node"
                    className="p-2 text-[#BCAF9C] dark:text-[#5A270F] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 self-start shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManager;
