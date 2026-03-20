import { useState, useEffect, useRef } from "react";
import "./News.css";
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
  AlertCircle,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "../lib/toast";
import { useTheme } from "../context/useTheme";
import { useSession } from "../lib/auth-client";

/* ─── Google Fonts: Inter + Space Grotesk ─── */
const FONT_LINK_ID = "news-page-fonts";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  source?: string;
  isEvent: boolean;
  eventDate?: string;
  createdAt: string;
  participants: string[];
  time: string;
}

const News = () => {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const user = session?.user;
  const roleName = typeof user?.role === "string" ? user.role : (user?.role as any)?.name || "";
  const secRoles = (user as any)?.secondaryRoles?.map((r: any) => r.name) || [];
  const allRoles = [roleName, ...secRoles];
  const isStudent = allRoles.includes("Student");
  const isStaff = ["Faculty", "Admin", "DepartmentHead", "SuperAdmin"].some(r => allRoles.includes(r));

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "news" | "events">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const MAX_EMAIL_LENGTH = 100;

  /* Inject premium Google Fonts scoped to this page */
  useEffect(() => {
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
    return () => {
      /* cleanup */
    };
  }, []);

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

  useEffect(() => {
    fetchNews();
  }, []);

  const [viewingEventId, setViewingEventId] = useState<number | null>(null);
  const [participantsData, setParticipantsData] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const fetchParticipants = async (eventId: number) => {
    if (viewingEventId === eventId) {
      setViewingEventId(null);
      return;
    }
    setViewingEventId(eventId);
    setLoadingParticipants(true);
    try {
      const { data } = await api.get(`/user/events/${eventId}/participants`);
      setParticipantsData(data.participants || []);
    } catch {
      toast.error("Failed to fetch participant registry");
      setViewingEventId(null);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleRegisterToggle = async (eventId: number, isRegistered: boolean) => {
    try {
      if (isRegistered) {
        await api.delete(`/user/events/${eventId}/register`);
        toast.success("Successfully unassigned from event.");
      } else {
        await api.post(`/user/events/${eventId}/register`);
        toast.success("Successfully joined event roster!");
      }
      fetchNews(); // Refresh news feed for updated participant list
    } catch {
      toast.error("Protocol Error: Registration modification failed.");
    }
  };

  /* Combined filter + search */
  const filteredNews = news.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "events" && item.isEvent) ||
      (filter === "news" && !item.isEvent);

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      (item.source || "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  /* Real-time email validation */
  const getEmailValidationState = () => {
    if (!emailTouched || !newsletterEmail) return "idle";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newsletterEmail.length > MAX_EMAIL_LENGTH) return "error";
    if (!emailRegex.test(newsletterEmail)) return "error";
    return "valid";
  };
  const emailValidation = getEmailValidationState();

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError("");
    setEmailTouched(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newsletterEmail.trim()) {
      setNewsletterError("Email address is required.");
      return;
    }
    if (newsletterEmail.length > MAX_EMAIL_LENGTH) {
      setNewsletterError(`Email must not exceed ${MAX_EMAIL_LENGTH} characters.`);
      return;
    }
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address (e.g. user@domain.com).");
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
      setEmailTouched(false);
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

  /* ─── Derived style tokens ─── */
  const isLight = theme === "light";

  return (
    <div
      className={`font-inter min-h-screen transition-colors duration-500 selection:bg-[#DF8142]/20 ${
        isLight ? "bg-[#FAF8F4]" : "bg-[#100704]"
      }`}
    >
      {/* ════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════ */}
      <section
        className={`relative pt-24 pb-40 overflow-hidden transition-colors duration-700 ${
          isLight
            ? "bg-gradient-to-br from-[#5A270F] via-[#6C3B1C] to-[#5A270F]"
            : "bg-gradient-to-br from-[#1A0B02] via-[#2A1205] to-[#100704]"
        }`}
      >
        {/* Background accents */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(223,129,66,0.18),transparent_55%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(90,39,15,0.3),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EEB38C]/30 to-transparent" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04] news-bg-grid"
          />
        </div>

        {/* Floating Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className="absolute top-8 right-6 sm:right-12 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
        >
          <div className="relative h-4 w-4">
            <Sun
              className={`h-4 w-4 absolute inset-0 transition-all duration-400 ${
                isLight ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-90"
              }`}
            />
            <Moon
              className={`h-4 w-4 absolute inset-0 transition-all duration-400 ${
                !isLight ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
              }`}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
            {isLight ? "Light" : "Dark"}
          </span>
        </button>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#EEB38C]/10 border border-[#EEB38C]/25 rounded-full text-[10px] font-extrabold uppercase tracking-[0.35em] text-[#EEB38C] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Megaphone className="h-3 w-3 text-[#DF8142] shrink-0" />
            Information Broadcast
          </div>

          {/* Headline */}
          <h1
            className="font-space-grotesk text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-5 leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 uppercase italic"
          >
            Terminal <span className="text-[#DF8142] not-italic">Chronicles</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-[#DF8142] not-italic">
              & ANNOUNCEMENTS.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-xl mx-auto text-[#EEB38C]/60 text-sm sm:text-base font-medium leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
            Real-time synchronization of the architectural nexus.
            System status, event sequencing, and strategic briefings.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 p-1.5 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-xl max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
            {(["all", "news", "events"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 py-1.5 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === t
                    ? "bg-[#DF8142] text-white shadow-lg shadow-[#DF8142]/30"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTENT GRID
      ════════════════════════════════════════ */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-28 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main Feed ── */}
          <div className="lg:col-span-2 space-y-10">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`h-[380px] rounded-[2.5rem] animate-pulse border ${
                    isLight
                      ? "bg-white border-[#EEB38C]/20"
                      : "bg-[#1D0B03] border-white/5"
                  }`}
                />
              ))
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item) => {
                const isRegistered = user?.id ? item.participants?.includes(user.id) : false;
                
                return (
                <article
                  key={item.id}
                  className={`group rounded-2xl overflow-hidden transition-all duration-500 flex flex-col sm:flex-row border shadow-lg ${
                    isLight
                      ? "bg-white border-[#D9D9C2]/30 shadow-[#5A270F]/5 hover:border-[#DF8142]/40"
                      : "bg-[#1A0B02] border-white/5 shadow-black/40 hover:border-white/10"
                  }`}
                >
                  {/* Left accent panel */}
                  <div
                    className={`sm:w-[160px] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0 ${
                      isLight ? "bg-[#EEB38C]/5" : "bg-white/[0.02]"
                    }`}
                  >
                    {/* Hover bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DF8142] to-[#EEB38C] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    {item.isEvent ? (
                      <>
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${isLight ? "bg-[#DF8142]/10" : "bg-[#DF8142]/15"}`}>
                          <Calendar className="h-6 w-6 text-[#DF8142] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <p
                          className={`font-space-grotesk text-2xl font-black tracking-tight leading-none mb-0.5 ${
                            isLight ? "text-[#5A270F]" : "text-[#EEB38C]"
                          }`}
                        >
                          {item.eventDate ? new Date(item.eventDate).getDate() : "--"}
                        </p>
                        <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}>
                          {item.eventDate
                            ? new Date(item.eventDate).toLocaleString("default", { month: "short" })
                            : "Event"}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${isLight ? "bg-[#DF8142]/10" : "bg-[#DF8142]/15"}`}>
                          <Zap className="h-6 w-6 text-[#DF8142] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}>
                          Update
                        </p>
                        <p className={`text-xs font-black mt-1 uppercase ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>
                          Signal
                        </p>
                      </>
                    )}
                  </div>

                  {/* Right content */}
                  <div className="flex-1 p-6 sm:p-7 flex flex-col">
                    {/* Meta row */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                          item.isEvent
                            ? "bg-[#DF8142] text-white shadow-sm"
                            : isLight
                            ? "bg-[#6C3B1C] text-white"
                            : "bg-[#EEB38C]/10 text-[#EEB38C]/80 border border-[#EEB38C]/20"
                        }`}
                      >
                        {item.isEvent ? "Protocol Event" : "System Alert"}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${
                          isLight ? "text-[#92664A]" : "text-[#EEB38C]/30"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 
                      className={`font-space-grotesk text-xl sm:text-2xl font-black tracking-tight leading-tight mb-3 group-hover:text-[#DF8142] transition-colors duration-300 italic uppercase ${
                        isLight ? "text-[#5A270F]" : "text-[#F5E6D8]"
                      }`}
                    >
                      {item.title}
                    </h2>
 
                    {/* Body */}
                    <p
                      className={`text-xs font-medium leading-relaxed mb-6 line-clamp-2 ${
                        isLight ? "text-[#6C3B1C]" : "text-[#EEB38C]/60"
                      }`}
                    >
                      {item.content}
                    </p>

                    {/* Footer */}
                    <div
                      className={`mt-auto flex items-center justify-between pt-4 border-t ${
                        isLight ? "border-[#D9D9C2]/40" : "border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-7 w-7 rounded-lg border flex items-center justify-center ${
                            isLight
                              ? "bg-[#EEB38C]/5 border-[#D9D9C2]/40 text-[#5A270F]"
                              : "bg-white/5 border-white/10 text-[#EEB38C]/40"
                          }`}
                        >
                          <Tag className="h-3 w-3" />
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest ${
                            isLight ? "text-[#92664A]" : "text-[#EEB38C]/30"
                          }`}
                        >
                          {item.source || "Nexus Prime"}
                        </span>
                      </div>

                      <button
                        title="Share Transmission"
                        className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all duration-300 hover:bg-[#DF8142] hover:text-white hover:border-[#DF8142] hover:shadow-lg ${
                          isLight
                            ? "bg-[#EEB38C]/5 border-[#D9D9C2]/40 text-[#5A270F]"
                            : "bg-white/5 border-white/10 text-[#EEB38C]/40"
                        }`}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Participation Controls */}
                    {item.isEvent && user && (
                      <div className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-4 ${isLight ? "border-[#D9D9C2]/40" : "border-white/5"}`}>
                        {isStudent && (
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer group/cb">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  checked={isRegistered}
                                  onChange={() => handleRegisterToggle(item.id, isRegistered)}
                                />
                                <div className={`h-5 w-5 rounded border-2 transition-all ${isRegistered ? "bg-[#DF8142] border-[#DF8142]" : isLight ? "border-[#5A270F]/20 group-hover/cb:border-[#DF8142]" : "border-white/20 group-hover/cb:border-[#DF8142]"}`}>
                                  {isRegistered && <CheckCircle className="h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                </div>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${isRegistered ? "text-[#DF8142]" : isLight ? "text-[#92664A]" : "text-white/40"}`}>
                                {isRegistered ? "Registered" : "Participate"}
                              </span>
                            </label>
                          </div>
                        )}
                        
                        {isStaff && (
                          <div className="flex flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <button
                              onClick={() => fetchParticipants(item.id)}
                              className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLight ? "bg-[#EEB38C]/10 hover:bg-[#EEB38C]/20 text-[#5A270F]" : "bg-white/5 hover:bg-white/10 text-white"}`}
                            >
                              <span>View Roster</span>
                              <span className="bg-[#DF8142] text-white px-1.5 py-0.5 rounded-md">
                                {item.participants?.length || 0}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {viewingEventId === item.id && isStaff && (
                       <div className={`mt-4 p-4 rounded-xl border animate-in slide-in-from-top-2 ${isLight ? "bg-[#FAF8F4] border-[#D9D9C2]/40" : "bg-[#100704] border-white/5"}`}>
                         <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isLight ? "text-[#5A270F]" : "text-[#EEB38C]"}`}>Registered Participants</h4>
                         {loadingParticipants ? (
                           <div className="flex items-center gap-2 text-[10px] text-[#DF8142] font-black uppercase">
                             <Loader2 className="h-3 w-3 animate-spin"/> Loading Directory...
                           </div>
                         ) : participantsData.length === 0 ? (
                           <p className={`text-[10px] font-medium ${isLight ? "text-[#92664A]" : "text-white/40"}`}>No participants registered yet.</p>
                         ) : (
                           <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                             {participantsData.map(p => (
                               <div key={p.user.id} className={`flex justify-between items-center p-2 rounded-lg ${isLight ? "bg-white border border-[#D9D9C2]/30" : "bg-white/[0.02] border border-white/5"}`}>
                                 <span className={`text-[10px] font-bold ${isLight ? "text-[#5A270F]" : "text-white"}`}>
                                   {p.user.first_name || "Unknown"} {p.user.last_name || ""}
                                 </span>
                                 <div className="flex items-center gap-2">
                                   <span className={`text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded bg-[#DF8142] text-white`}>
                                     {p.user.role?.name || "Student"}
                                   </span>
                                   {p.user.batch && (
                                     <span className={`text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded ${isLight ? "bg-[#5A270F]/5 text-[#5A270F]" : "bg-white/5 text-white/50"}`}>
                                       B-{p.user.batch}
                                     </span>
                                   )}
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                    )}

                  </div>
                </article>
              );
              })
            ) : (
              <div
                className={`py-32 rounded-[2.5rem] border text-center ${
                  isLight
                    ? "bg-white border-[#E4DDD4]"
                    : "bg-[#1A0B02] border-white/8"
                }`}
              >
                <div
                  className={`h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm ${
                    isLight ? "bg-[#F0EAE2]" : "bg-white/5"
                  }`}
                >
                  <Search className={`h-10 w-10 ${isLight ? "text-[#B8967A]" : "text-white/30"}`} />
                </div>
                <h3
                  className={`font-space-grotesk text-2xl font-black mb-3 ${isLight ? "text-[#3D1A06]" : "text-[#EEB38C]"}`}
                >
                  No Signals Found
                </h3>
                <p className={`text-sm font-medium max-w-xs mx-auto ${isLight ? "text-[#92664A]" : "text-white/40"}`}>
                  The news cluster currently has no active transmissions for this filter.
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-8">

            {/* Search Module */}
            <div
              className={`p-6 rounded-2xl border shadow-lg transition-colors duration-300 ${
                isLight
                  ? "bg-white border-[#D9D9C2]/40 shadow-[#5A270F]/5"
                  : "bg-[#1A0B02] border-white/5 shadow-black/30"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                    isLight ? "text-[#5A270F]" : "text-[#EEB38C]/40"
                  }`}
                >
                  Signal Scan
                </h3>
                {searchQuery && (
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#DF8142]/10 text-[#DF8142] animate-in fade-in duration-200">
                    {filteredNews.length}
                  </span>
                )}
              </div>

              <div className="relative group">
                <input
                  ref={searchRef}
                  id="news-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan nexus news..."
                  className={`font-inter w-full h-10 rounded-xl pl-9 pr-8 text-[11px] font-bold outline-none transition-all duration-200 border ${
                    isLight
                      ? "bg-slate-50 border-[#D9D9C2]/50 text-[#5A270F] placeholder:text-[#92664A]/40 focus:bg-white focus:border-[#DF8142]"
                      : "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#DF8142]/60"
                  }`}
                />
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors group-focus-within:text-[#DF8142] ${
                    isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#DF8142] hover:text-white ${
                      isLight ? "bg-[#EEB38C]/20 text-[#92664A]" : "bg-white/10 text-white/50"
                    }`}
                    title="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {searchQuery && filteredNews.length === 0 && (
                <p className={`mt-4 text-[10px] font-extrabold uppercase tracking-widest text-center animate-in fade-in duration-300 ${isLight ? "text-[#B8967A]" : "text-white/30"}`}>
                  No transmissions match your query.
                </p>
              )}
            </div>

            {/* Studio Digest Newsletter */}
            <div
              className={`p-6 rounded-2xl shadow-xl relative overflow-hidden group transition-all duration-500 ${
                isLight
                  ? "bg-gradient-to-br from-[#5A270F] via-[#6C3B1C] to-[#5A270F] shadow-[#5A270F]/20"
                  : "bg-gradient-to-br from-[#1A0B02] to-[#2A1205] shadow-black/40 border border-white/5"
              }`}
            >
              {/* Decorative orb */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-bl-[5rem] translate-x-14 -translate-y-14 group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-700 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-tr-[4rem] -translate-x-10 translate-y-10 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-700 pointer-events-none" />

              <h3
                className="font-space-grotesk text-xl font-black mb-2 relative z-10 leading-tight text-white italic uppercase"
              >
                THE STUDIO <br /> <span className="text-[#DF8142] not-italic">DIGEST.</span>
              </h3>
              <p className={`text-[10px] font-medium mb-6 relative z-10 ${isLight ? "text-white/70" : "text-[#EEB38C]/50"}`}>
                Monthly technical benchmarks delivered directly to your studio terminal.
              </p>

              <form onSubmit={handleNewsletterSubscribe} className="relative z-10" noValidate>
                {/* Email input — white bg for clear readability on the orange card */}
                <div className="relative mb-1">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (newsletterError) setNewsletterError("");
                    }}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="your@email.com"
                    disabled={subscribing || subscribed}
                    maxLength={MAX_EMAIL_LENGTH + 1}
                    autoComplete="email"
                    className={`w-full rounded-xl pl-4 pr-11 text-sm font-semibold outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-2 ${
                      newsletterError || emailValidation === "error"
                        ? "bg-white border-red-400 text-[#3D1A06] placeholder:text-[#B8967A] focus:ring-4 focus:ring-red-400/20"
                        : emailValidation === "valid"
                        ? "bg-white border-emerald-400 text-[#3D1A06] placeholder:text-[#B8967A] focus:ring-4 focus:ring-emerald-400/20"
                        : "bg-white border-white/30 text-[#3D1A06] placeholder:text-[#B8967A] focus:border-white focus:ring-4 focus:ring-white/20"
                    } input-height font-inter`}
                  />
                  {/* Inline validation icon */}
                  {emailTouched && newsletterEmail && !subscribing && !subscribed && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {emailValidation === "valid" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 animate-in zoom-in duration-200" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 animate-in zoom-in duration-200" />
                      )}
                    </span>
                  )}
                </div>

                {/* Error + counter row */}
                <div className="flex items-start justify-between gap-2 mb-4 min-h-[20px]">
                  {newsletterError || (emailTouched && emailValidation === "error") ? (
                    <p className="text-[11px] font-bold text-white flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300 drop-shadow-sm">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-white" />
                      {newsletterError ||
                        (!newsletterEmail.trim()
                          ? "Email address is required."
                          : newsletterEmail.length > MAX_EMAIL_LENGTH
                          ? `Max ${MAX_EMAIL_LENGTH} characters allowed.`
                          : "Enter a valid email (e.g. user@domain.com).")}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-[9px] font-bold font-mono ml-auto shrink-0 ${
                      newsletterEmail.length > MAX_EMAIL_LENGTH
                        ? "text-white font-black"
                        : "text-white/50"
                    }`}
                  >
                    {newsletterEmail.length}/{MAX_EMAIL_LENGTH}
                  </span>
                </div>

                {/* Submit button — always high-contrast white bg on orange card */}
                <button
                  type="submit"
                  disabled={subscribing || subscribed || !newsletterEmail.trim()}
                  className={`w-full rounded-xl font-extrabold uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    subscribed
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-white text-[#C56A2A] hover:bg-[#3D1A06] hover:text-white disabled:opacity-50 shadow-white/30"
                  } input-height`}
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Transmitting…
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
            <div
              className={`p-6 rounded-2xl border shadow-lg text-center transition-colors duration-300 ${
                isLight
                  ? "bg-white border-[#D9D9C2]/40 shadow-[#5A270F]/5"
                  : "bg-[#1A0B02] border-white/5 shadow-black/30"
              }`}
            >
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[7.5px] font-black uppercase tracking-widest mb-4 ${
                  isLight
                    ? "bg-[#5A270F]/5 text-[#5A270F]"
                    : "bg-[#EEB38C]/10 text-[#EEB38C]"
                }`}
              >
                <div className="h-1 w-1 rounded-full bg-[#DF8142] animate-pulse" />
                Control Relay
              </div>

              <h3
                className={`font-space-grotesk text-xs font-black uppercase tracking-[0.2em] mb-2 ${
                  isLight ? "text-[#5A270F]" : "text-white"
                }`}
              >
                Strategic Support
              </h3>
              <p className={`text-[9.5px] font-medium mb-6 leading-relaxed ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}>
                Contact our operations node for priority technical briefing.
              </p>

              <Link
                to="/about"
                className={`flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest transition-colors group ${
                  isLight
                    ? "text-[#DF8142] hover:text-[#5A270F]"
                    : "text-[#EEB38C] hover:text-white"
                }`}
              >
                Reach Control
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
