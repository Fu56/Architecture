import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "react-toastify";

interface NewsItem {
  id: number;
  title: string;
  content: string;
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

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/common/news");
      setNews(res.data);
    } catch {
      toast.error("Failed to load news feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/news", {
        title,
        content,
        isEvent,
        eventDate: isEvent ? eventDate : null,
      });
      toast.success("News published successfully");
      setShowForm(false);
      setTitle("");
      setContent("");
      setIsEvent(false);
      setEventDate("");
      fetchNews();
    } catch {
      toast.error("Failed to publish news");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success("News item deleted");
      fetchNews();
    } catch {
      toast.error("Failed to delete news item");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            Announcement Center
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Broadcast news and events to all users
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            showForm
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:-translate-y-1 hover:bg-indigo-700"
          }`}
        >
          {showForm ? (
            "Cancel Release"
          ) : (
            <>
              <Plus className="h-5 w-5" />
              New Announcement
            </>
          )}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 sm:p-10 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., Winter Semester Thesis Submissions Open"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Event Toggle
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                        Is this a date-specific event?
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEvent(!isEvent)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        isEvent ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          isEvent ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {isEvent && (
                    <div className="animate-in fade-in duration-300">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Event Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        required={isEvent}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your announcement message here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4 text-slate-900 font-medium outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button
                type="submit"
                className="flex items-center gap-2 px-10 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/20"
              >
                Release Announcement
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
          Active Journal Feed
        </h3>

        {loading ? (
          <div className="h-40 bg-slate-50 rounded-[2rem] animate-pulse flex items-center justify-center">
            <span className="text-slate-300 font-bold uppercase tracking-widest">
              Synchronizing Feed...
            </span>
          </div>
        ) : news.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">
              No announcements released yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {item.isEvent ? (
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 rounded-full flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Event
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100 rounded-full flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3" />
                          News
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-slate-500 font-medium leading-relaxed max-w-3xl">
                      {item.content}
                    </p>

                    {item.isEvent && item.eventDate && (
                      <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit">
                        <AlertCircle className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Scheduled: {new Date(item.eventDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all self-end sm:self-start opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-5 w-5" />
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
