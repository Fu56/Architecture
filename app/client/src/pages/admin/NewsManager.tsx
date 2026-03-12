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

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.05em] mt-2 ml-1 animate-in fade-in slide-in-from-top-1 drop-shadow-sm">
        {message}
      </p>
    );
  };

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

    // Broadcast Validation Protocols
    if (!title.trim()) {
      newErrors.title = "Transmission Aborted: Announcement Headline required.";
    }

    if (!content.trim()) {
      newErrors.content =
        "Transmission Aborted: Intelligence Body Narrative missing.";
    }

    if (isEvent && !eventDate) {
      newErrors.eventDate =
        "Temporal Error: Event Sequencing requires a valid date marker.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Validation failed: Please correct the highlighted errors.");
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
      toast.success("Intelligence successfully broadcasted");
      setShowForm(false);
      setTitle("");
      setContent("");
      setIsEvent(false);
      setEventDate("");
      fetchNews();
    } catch {
      toast.error("Protocol Breach: Announcement release failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to terminate this announcement node?",
      )
    )
      return;
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success("Announcement node terminated");
      fetchNews();
    } catch {
      toast.error("Protocol Breach: Failed to terminate node");
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-[#92664A]/20 dark:border-white/10 border-t-[#DF8142] rounded-full animate-spin" />
          <Loader2 className="h-8 w-8 text-[#DF8142] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-black text-[#5A270F]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.4em]">
          Synchronizing Feed...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#EEB38C]/5 dark:bg-background p-8 rounded-[3rem] border border-[#92664A]/20 dark:border-white/10 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="h-14 w-14 bg-[#5A270F] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter">
              Announcement Terminal
            </h2>
            <p className="text-xs text-[#92664A] dark:text-[#EEB38C]/40 font-medium tracking-wide uppercase">
              Broadcasting Global Intelligence
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`relative z-10 w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
            showForm
              ? "bg-white dark:bg-card border-2 border-[#92664A]/20 dark:border-white/10 text-[#5A270F] dark:text-[#EEB38C]/40 hover:text-rose-600 hover:border-rose-100 shadow-lg"
              : "bg-[#5A270F] text-white shadow-2xl shadow-[#5A270F]/20 hover:-translate-y-1 hover:bg-[#6C3B1C]"
          }`}
        >
          {showForm ? (
            <>Cancel Release</>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Initialize Release
            </>
          )}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white dark:bg-card rounded-[3.5rem] border border-[#92664A]/20 dark:border-white/10 p-10 sm:p-14 shadow-3xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-[0.02]">
            <Zap className="h-64 w-64" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/40 mb-3 ml-1">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    placeholder="E.g., Winter Semester Thesis Submissions Open"
                    className={`w-full bg-[#EEB38C]/5 dark:bg-background border ${
                      errors.title
                        ? "border-rose-400 bg-red-50/20"
                        : "border-[#92664A]/20 dark:border-white/10"
                    } rounded-[1.5rem] px-8 py-5 text-[#5A270F] dark:text-[#EEB38C] font-black text-lg outline-none focus:ring-4 focus:ring-[#DF8142]/5 focus:bg-white dark:bg-card transition-all placeholder:text-[#5A270F]/20`}
                  />
                  <FieldError message={errors.title} />
                </div>

                <div className="p-8 bg-[#EEB38C]/5 dark:bg-background rounded-[2.5rem] border border-[#92664A]/20 dark:border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-widest">
                        Event Sequencing
                      </h4>
                      <p className="text-[10px] text-[#92664A] dark:text-[#EEB38C]/40 font-bold uppercase tracking-wider mt-1">
                        Enable temporal event scheduling
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Toggle Event Sequencing"
                      onClick={() => setIsEvent(!isEvent)}
                      className={`relative w-14 h-7 rounded-full transition-all duration-500 ${
                        isEvent ? "bg-[#DF8142]" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white dark:bg-card rounded-full shadow-md transition-all duration-500 ${
                          isEvent ? "left-8" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {isEvent && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-3 ml-1">
                        Temporal Markers (Date & Time)
                      </label>
                      <input
                        id="eventDate"
                        type="datetime-local"
                        title="Temporal Markers (Date & Time)"
                        value={eventDate}
                        onChange={(e) => {
                          setEventDate(e.target.value);
                          if (errors.eventDate)
                            setErrors((prev) => ({ ...prev, eventDate: "" }));
                        }}
                        className={`w-full bg-white dark:bg-card border ${
                          errors.eventDate
                            ? "border-rose-400 bg-red-50/20"
                            : "border-[#92664A]/20 dark:border-white/10"
                        } rounded-2xl px-6 py-4 text-sm font-black text-[#2A1205] outline-none focus:ring-4 focus:ring-[#DF8142]/10 transition-all`}
                      />
                      <FieldError message={errors.eventDate} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/40 mb-3 ml-1">
                  Message Body
                </label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content)
                      setErrors((prev) => ({ ...prev, content: "" }));
                  }}
                  placeholder="Draft your intelligence transmission here..."
                  className={`w-full bg-[#EEB38C]/5 dark:bg-background border ${
                    errors.content
                      ? "border-rose-400 bg-red-50/20"
                      : "border-[#92664A]/20 dark:border-white/10"
                  } rounded-[2rem] px-8 py-6 text-[#5A270F] dark:text-[#EEB38C] font-medium text-base outline-none focus:ring-4 focus:ring-[#DF8142]/5 focus:bg-white dark:bg-card transition-all resize-none min-h-[280px]`}
                />
                <FieldError message={errors.content} />
              </div>
            </div>

            <div className="flex justify-end pt-10 border-t border-slate-50">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-4 px-12 py-5 bg-[#5A270F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] transition-all hover:-translate-y-1 shadow-2xl shadow-[#5A270F]/20 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Deploy Transmission
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 ml-4">
          <Clock className="h-4 w-4 text-[#DF8142]/90" />
          <h3 className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em]">
            Journal Archive Transmission
          </h3>
        </div>

        {news.length === 0 ? (
          <div className="p-24 text-center bg-[#EEB38C]/5 dark:bg-background rounded-[4rem] border border-dashed border-[#92664A]/20 dark:border-white/10">
            <Info className="h-16 w-16 text-[#EEB38C] mx-auto mb-6" />
            <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-xs font-black uppercase tracking-widest">
              Awaiting Signal: No archives detected.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-card p-10 rounded-[3rem] border border-[#92664A]/20 dark:border-white/10 transition-all duration-700 hover:border-[#DF8142]/20 hover:shadow-3xl hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#EEB38C]/10 dark:bg-background rounded-bl-[10rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      {item.isEvent ? (
                        <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-[0.2em] border border-amber-100 rounded-full flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          Temporal Event
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-[#DF8142]/10 text-[#DF8142] text-[9px] font-black uppercase tracking-[0.2em] border border-[#DF8142]/20 rounded-full flex items-center gap-2">
                          <Sparkles className="h-3 w-3" />
                          Nexus News
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {item.source && (
                        <span className="text-[10px] font-black text-[#DF8142] uppercase tracking-widest flex items-center gap-2 px-3 py-1 bg-[#DF8142]/5 border border-[#DF8142]/10 rounded-lg">
                          Auth: {item.source}
                        </span>
                      )}
                    </div>

                    <h4 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-none lowercase">
                      {item.title}
                    </h4>

                    <p className="text-[#5A270F] dark:text-[#EEB38C] font-medium text-lg leading-relaxed max-w-4xl italic">
                      "{item.content}"
                    </p>

                    {item.isEvent && item.eventDate && (
                      <div className="mt-6 flex items-center gap-4 p-5 bg-[#EEB38C]/5 dark:bg-background border border-[#92664A]/20 dark:border-white/10 rounded-[1.5rem] w-fit">
                        <div className="h-8 w-8 bg-[#DF8142]/90 rounded-lg flex items-center justify-center text-white">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black text-[#6C3B1C] dark:text-[#EEB38C]/80 uppercase tracking-widest">
                          Target Sequencing:{" "}
                          {new Date(item.eventDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-4 text-gray-400 dark:text-white/30 hover:text-rose-600 hover:bg-red-50 rounded-[1.2rem] transition-all self-end lg:self-start opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                    title="Terminate Node"
                  >
                    <Trash2 className="h-6 w-6" />
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
