import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Zap,
  Tag,
  Share2,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "../lib/toast";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  source?: string;
  isEvent: boolean;
  eventDate?: string;
  createdAt: string;
  time: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "news" | "events">("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await api.get("/common/news");
        setNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    if (filter === "all") return true;
    if (filter === "events") return item.isEvent;
    if (filter === "news") return !item.isEvent;
    return true;
  });

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError("");

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newsletterEmail.trim()) {
      setNewsletterError("Email address is required.");
      return;
    }

    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);
    try {
      const { data } = await api.post("/common/subscribe", {
        email: newsletterEmail.trim(),
      });
      toast.success(data.message || "Transmission initialized successfully!");
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error: unknown) {
      let message = "Failed to initialize transmission. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message = axiosError.response?.data?.message || message;
      }
      setNewsletterError(message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-background selection:bg-[#DF8142]/20 transition-colors duration-500">
      {/* Immersive Header */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-[#5A270F] dark:bg-[#1A0B02] transition-colors duration-700">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(223,129,66,0.18),transparent_50%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EEB38C]/20 to-transparent" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#EEB38C]/10 border border-[#EEB38C]/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#EEB38C] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Megaphone className="h-3 w-3 text-[#DF8142]" /> Information
            Broadcast
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-6 leading-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            CHRONICLES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142]">
              & ANNOUNCEMENTS.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-[#EEB38C]/70 text-lg font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
            Synchronize with the latest developments in our architectural nexus.
            From system upgrades to global industry summits.
          </p>

          {/* Filter Controls */}
          <div className="flex items-center justify-center gap-2 p-2 bg-[#6C3B1C]/30 backdrop-blur-xl border border-white/5 rounded-2xl max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
            {(["all", "news", "events"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === t
                    ? "bg-[#DF8142] text-white shadow-2xl shadow-[#DF8142]/30"
                    : "text-[#EEB38C]/40 hover:text-[#EEB38C] hover:bg-white/5 dark:bg-card/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Cluster */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-24 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-12">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-card h-[400px] rounded-[3rem] animate-pulse border border-[#EEB38C]/20"
                />
              ))
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="group bg-white dark:bg-card rounded-[3rem] border border-[#D9D9C2] dark:border-white/10 shadow-xl shadow-[#92664A]/5 overflow-hidden hover:shadow-2xl hover:shadow-[#DF8142]/10 transition-all duration-500 flex flex-col sm:flex-row"
                >
                  <div className="sm:w-1/3 bg-[#FAF8F4] dark:bg-white/5 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#DF8142] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    {item.isEvent ? (
                      <>
                        <Calendar className="h-10 w-10 text-[#DF8142] mb-6 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight leading-none mb-1">
                          {item.eventDate
                            ? new Date(item.eventDate).getDate()
                            : "--"}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-white/40">
                          {item.eventDate
                            ? new Date(item.eventDate).toLocaleString(
                                "default",
                                { month: "short" },
                              )
                            : "Event"}
                        </p>
                      </>
                    ) : (
                      <>
                        <Zap className="h-10 w-10 text-[#DF8142] mb-6 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-white/40">
                          Transmission
                        </p>
                        <p className="text-sm font-black text-[#5A270F] dark:text-[#EEB38C] mt-2">
                          Update Node
                        </p>
                      </>
                    )}
                  </div>

                  <div className="sm:w-2/3 p-10 sm:p-12 relative flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          item.isEvent
                            ? "bg-[#DF8142]/10 text-[#DF8142]"
                            : "bg-[#EEB38C]/10 text-[#92664A] dark:text-[#EEB38C]/40"
                        }`}
                      >
                        {item.isEvent ? "Protocol Event" : "System Alert"}
                      </span>
                      <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40/60">
                        <Clock className="h-3 w-3" /> {item.time}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-tight mb-6 group-hover:text-[#DF8142] transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-[#5A270F] dark:text-foreground/70 font-medium leading-relaxed mb-8 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-[#EEB38C]/20 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#FAF8F4] dark:bg-white/5 border border-[#EEB38C]/30 dark:border-white/10 flex items-center justify-center text-[#92664A] dark:text-[#EEB38C]/60">
                          <Tag className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/40">
                          Metadata Source: {item.source || "Nexus Prime"}
                        </span>
                      </div>

                      <button
                        title="Share Transmission"
                        className="h-12 w-12 rounded-2xl bg-[#FAF8F4] dark:bg-white/5 flex items-center justify-center text-[#92664A] dark:text-[#EEB38C]/60 hover:bg-[#DF8142] dark:hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-[#EEB38C]/20 dark:border-white/10"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="py-32 bg-white dark:bg-card rounded-[3rem] border border-[#D9D9C2] dark:border-white/10 text-center">
                <div className="h-20 w-20 bg-[#EFEDED] dark:bg-background rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Search className="h-10 w-10 text-gray-400 dark:text-white/30" />
                </div>
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] mb-2">
                  No Signals Found
                </h3>
                <p className="text-gray-500 dark:text-white/40 font-medium max-w-xs mx-auto">
                  The news cluster currently has no active transmissions for
                  this filter.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-12">
            {/* Search Module */}
            <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-[#EEB38C]/30 dark:border-white/5 shadow-xl shadow-[#92664A]/5">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/40 mb-8">
                Signal Scan
              </h3>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="w-full h-16 bg-[#FAF8F4] dark:bg-white/5 border border-[#EEB38C]/20 dark:border-white/10 rounded-2xl pl-12 pr-6 text-sm font-bold text-[#5A270F] dark:text-white outline-none focus:ring-4 focus:ring-[#DF8142]/10 focus:border-[#DF8142]/90 transition-all font-sans"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#92664A] dark:text-[#EEB38C]/40 group-focus-within:text-[#DF8142] transition-colors" />
              </div>
            </div>

            {/* Newsletter Module */}
            <div className="bg-[#DF8142] p-10 rounded-[3rem] shadow-2xl shadow-[#DF8142]/30 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-card/10 rounded-bl-[5rem] translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700" />
              <h3 className="text-2xl font-black mb-4 relative z-10 leading-none">
                THE STUDIO <br /> DIGEST.
              </h3>
              <p className="text-[#EEB38C] text-sm font-medium mb-8 relative z-10">
                Monthly curation of technical benchmarks directly to your studio
                terminal.
              </p>
              <form
                onSubmit={handleNewsletterSubscribe}
                className="relative z-10"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterError) setNewsletterError("");
                  }}
                  placeholder="Terminal Email..."
                  disabled={subscribing || subscribed}
                  className={`w-full h-14 bg-white/15 dark:bg-card/15 border ${newsletterError ? "border-[#5A270F]" : "border-white/20"} rounded-xl px-5 text-sm font-bold placeholder:text-white/50 mb-2 outline-none focus:bg-white/25 dark:bg-card/25 transition-all disabled:opacity-50`}
                />
                {newsletterError && (
                  <p className="text-xs text-[#5A270F] dark:text-[#EEB38C] font-black mb-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#5A270F]" />
                    {newsletterError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={
                    subscribing || subscribed || !newsletterEmail.trim()
                  }
                  className={`w-full h-14 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    subscribed
                      ? "bg-[#5A270F] text-white"
                      : "bg-white dark:bg-card text-[#DF8142] hover:bg-[#5A270F] hover:text-white disabled:opacity-50 shadow-white/10"
                  }`}
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Transmitting...
                    </>
                  ) : subscribed ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Transmission Complete
                    </>
                  ) : (
                    "Initialize Transmission"
                  )}
                </button>
              </form>
            </div>

            {/* Support Link */}
            <div className="bg-white dark:bg-card p-10 rounded-[3rem] border border-[#EEB38C]/30 dark:border-white/10 shadow-xl shadow-[#92664A]/5 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5A270F]/5 dark:bg-[#EEB38C]/10 rounded-full text-[8px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />{" "}
                Live Support
              </div>
              <h3 className="text-sm font-black text-[#5A270F] dark:text-white uppercase tracking-widest mb-2">
                Need Field Intel?
              </h3>
              <p className="text-xs text-[#92664A] dark:text-white/40 font-medium mb-8">
                Contact our operations node for priority technical support.
              </p>
              <Link
                to="/about"
                className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-[#DF8142] dark:text-[#DF8142] hover:text-[#5A270F] dark:text-[#EEB38C] dark:hover:text-white transition-colors group"
              >
                Reach Control{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
