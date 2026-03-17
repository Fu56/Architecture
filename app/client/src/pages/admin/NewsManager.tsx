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
    <div className="min-h-screen -m-4 sm:-m-6 p-4 sm:p-6 bg-[#FAF8F4] dark:bg-[#0C0603] transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-1000">
        {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#EEB38C]/5 dark:bg-[#1A0B02] p-4 rounded-xl border border-[#92664A]/20 dark:border-white/10 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-8 w-8 bg-[#5A270F] rounded-lg flex items-center justify-center text-white shadow-md">
            <Megaphone className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic leading-none mb-1">
              Nexus Broadcast <span className="not-italic text-[#DF8142]">Hub</span>
            </h2>
            <p className="text-[7.5px] text-[#92664A] dark:text-[#EEB38C]/40 font-black tracking-widest uppercase leading-none">
              Deploy Global Intelligence
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`relative z-10 w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${
            showForm
              ? "bg-white dark:bg-[#1A0B02] border border-[#92664A]/20 dark:border-white/10 text-[#5A270F] dark:text-[#EEB38C] hover:text-rose-600 shadow-sm"
              : "bg-[#5A270F] text-white shadow-lg shadow-[#5A270F]/20 hover:bg-[#6C3B1C]"
          }`}
        >
          {showForm ? (
            <>Cancel Transmission</>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              Init Broadcast
            </>
          )}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white dark:bg-[#1A0B02] rounded-xl border border-[#D9D9C2] dark:border-[#DF8142]/20 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
            <Zap className="h-32 w-32" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40 mb-1.5 ml-1">
                    Signal Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    placeholder="Broadcast Subject..."
                    className={`w-full h-10 bg-[#EEB38C]/5 dark:bg-white/5 border ${
                      errors.title
                        ? "border-rose-400 bg-red-50/10"
                        : "border-[#92664A]/20 dark:border-white/10"
                    } rounded-lg px-4 text-[#5A270F] dark:text-[#EEB38C] font-black text-xs outline-none focus:ring-4 focus:ring-[#DF8142]/5 focus:bg-white dark:bg-[#1A0B02] transition-all`}
                  />
                  <FieldError message={errors.title} />
                </div>

                <div className="p-4 bg-[#EEB38C]/5 dark:bg-white/5 rounded-xl border border-[#92664A]/20 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.1em]">
                        Temporal Event
                      </h4>
                      <p className="text-[7.5px] text-[#92664A] dark:text-[#EEB38C]/40 font-black uppercase tracking-wider leading-none">
                        Sequence for scheduling
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Toggle Event Sequencing"
                      onClick={() => setIsEvent(!isEvent)}
                      className={`relative w-9 h-5 rounded-full transition-all duration-500 ${
                        isEvent ? "bg-[#DF8142]" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-500 ${
                          isEvent ? "left-4.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
 
                  {isEvent && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-[8px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/30 mb-1.5 ml-1">
                        Timeline Marker
                      </label>
                      <input
                        id="eventDate"
                        type="datetime-local"
                        title="Temporal Markers"
                        value={eventDate}
                        onChange={(e) => {
                          setEventDate(e.target.value);
                          if (errors.eventDate)
                            setErrors((prev) => ({ ...prev, eventDate: "" }));
                        }}
                        className={`w-full h-10 bg-white dark:bg-white/5 border border-[#92664A]/20 dark:border-white/10 rounded-lg px-3 text-[10px] font-black text-[#5A270F] dark:text-[#EEB38C] outline-none transition-all`}
                      />
                    </div>
                  )}
                </div>
              </div>

                <div>
                  <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40 mb-1.5 ml-1">
                    Transmission Body
                  </label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (errors.content)
                        setErrors((prev) => ({ ...prev, content: "" }));
                    }}
                    placeholder="Intelligence narrative..."
                    className={`w-full bg-[#EEB38C]/5 dark:bg-white/5 border border-[#92664A]/20 dark:border-white/10 rounded-xl px-4 py-3 text-[#5A270F] dark:text-[#EEB38C] font-medium text-xs outline-none focus:bg-white dark:bg-[#1A0B02] focus:ring-4 focus:ring-[#DF8142]/5 transition-all resize-none min-h-[140px]`}
                  />
                  <FieldError message={errors.content} />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#D9D9C2]/40 dark:border-white/5">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2.5 px-6 py-2 bg-[#5A270F] text-white rounded-lg text-[8px] font-black uppercase tracking-[0.1em] hover:bg-[#6C3B1C] transition-all shadow-lg shadow-[#5A270F]/20 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    Deploy Transmission
                    <ChevronRight className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 ml-1">
          <Clock className="h-3 w-3 text-[#DF8142]" />
          <h3 className="text-[8px] font-black text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em]">
            Archive Registry
          </h3>
        </div>

        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-10 bg-white dark:bg-[#1A0B02] rounded-2xl border border-[#D9D9C2] dark:border-white/5 shadow-xl shadow-[#5A270F]/5">
            <div className="relative mb-8">
              <div className="h-20 w-20 bg-[#EEB38C]/10 dark:bg-white/5 rounded-[2rem] flex items-center justify-center animate-pulse">
                <Info className="h-10 w-10 text-[#EEB38C]/60" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#DF8142] rounded-xl flex items-center justify-center text-white shadow-lg animate-bounce">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic mb-2">
              Awaiting <span className="text-[#DF8142] not-italic">Signal</span>
            </h3>
            <p className="text-[9px] text-[#92664A] dark:text-[#EEB38C]/40 font-black uppercase tracking-[0.3em] text-center max-w-[240px] leading-relaxed">
              The broadcast registry is currently void. Initialize a new transmission node to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-[#1A0B02] p-6 rounded-xl border border-[#D9D9C2] dark:border-white/10 transition-all duration-500 hover:border-[#DF8142]/40 hover:shadow-lg overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEB38C]/5 dark:bg-white/5 rounded-bl-[4rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {item.isEvent ? (
                        <span className="px-2 py-0.5 bg-[#DF8142] text-white text-[7px] font-black uppercase tracking-[0.1em] rounded flex items-center gap-1">
                          <Calendar className="h-2 w-2" />
                          Event
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#5A270F] text-white text-[7px] font-black uppercase tracking-[0.1em] rounded flex items-center gap-1">
                          <Sparkles className="h-2 w-2" />
                          News
                        </span>
                      )}
                      <span className="text-[7.5px] font-black text-[#92664A] dark:text-white/30 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="h-2 w-2" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {item.source && (
                        <span className="text-[7.5px] font-black text-[#DF8142] uppercase tracking-widest px-2 py-0.5 bg-[#DF8142]/5 border border-[#DF8142]/10 rounded">
                          Auth: {item.source}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-none italic uppercase">
                      {item.title}
                    </h4>
 
                    <p className="text-[#5A270F] dark:text-[#EEB38C] font-medium text-xs leading-relaxed max-w-4xl opacity-70">
                      {item.content}
                    </p>

                    {item.isEvent && item.eventDate && (
                      <div className="mt-4 flex items-center gap-3 p-3.5 bg-[#EEB38C]/5 dark:bg-background border border-[#92664A]/20 dark:border-white/10 rounded-xl w-fit">
                        <div className="h-7 w-7 bg-[#DF8142]/90 rounded-lg flex items-center justify-center text-white">
                          <AlertCircle className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-black text-[#6C3B1C] dark:text-[#EEB38C]/80 uppercase tracking-widest">
                          Target Sequencing:{" "}
                          {new Date(item.eventDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 dark:text-white/20 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-md transition-all self-end lg:self-start opacity-0 group-hover:opacity-100"
                    title="Terminate Node"
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
  </div>
  );
};

export default NewsManager;
