// cSpell:ignore departmenthead
import { useState, useEffect, useRef } from "react";
import "./News.css";
import {
  Calendar,
  Clock,
  Search,
  Zap,
  Tag,
  Share2,
  Loader2,
  CheckCircle,
  Users
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "../lib/toast";
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
  const { data: session } = useSession();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any; 
  
  const roleName =
    typeof user?.role === "string" ? user.role : user?.role?.name || "";
  const secRoles =
    (user?.secondaryRoles as { name: string }[] | undefined)?.map(
      (r) => r.name,
    ) || [];
  const allRoles = [roleName, ...secRoles].map(r => r.toLowerCase());
  
  const isStaff = ["faculty", "admin", "departmenthead", "superadmin"].some(
    (r) => allRoles.includes(r),
  );

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "news" | "events">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const MAX_EMAIL_LENGTH = 100;

  useEffect(() => {
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const handleRegisterToggle = async (
    eventId: number,
    isRegistered: boolean,
  ) => {
    try {
      if (isRegistered) {
        await api.delete(`/user/events/${eventId}/register`);
        toast.success("Successfully unassigned from event.");
      } else {
        await api.post(`/user/events/${eventId}/register`);
        toast.success("Successfully joined event roster!");
      }
      fetchNews();
    } catch {
      toast.error("Protocol Error: Registration modification failed.");
    }
  };

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

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError("");

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
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);
    try {
      await api.post("/common/subscribe", {
        email: newsletterEmail.trim(),
      });
      toast.success("Transmission initialized: You will now receive updates.");
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 8000);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errMsg = (error as any).response?.data?.message || "Subscription failed.";
      setNewsletterError(errMsg);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="font-inter min-h-screen bg-[#FDFCFB] dark:bg-[#5A270F] transition-colors duration-500">
      <section className="relative pt-24 pb-48 overflow-hidden bg-[#FAF8F4] dark:bg-[#2C1105] border-b border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-sm">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(223,129,66,0.15),transparent_55%)]" />
          <div className="absolute inset-0 opacity-10 blueprint-grid-dark" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-[#6C3B1C] border border-[#EEB38C]/50 dark:border-[#DF8142]/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] dark:text-[#EEB38C] mb-8 shadow-sm">
            <Zap className="h-3 w-3" /> System Feed
          </div>

          <h1 className="font-space-grotesk text-5xl sm:text-6xl lg:text-8xl font-black text-[#5A270F] dark:text-white tracking-tighter mb-6 uppercase italic">
            Terminal <span className="text-[#DF8142] not-italic">Chronicles</span>
            <br />
            <span className="text-[#92664A] dark:text-[#EEB38C]/80">& ANNOUNCEMENTS.</span>
          </h1>

          <p className="max-w-xl mx-auto text-[#92664A] dark:text-[#EEB38C]/80 text-base font-bold leading-relaxed mb-12 border-l-2 border-[#DF8142] pl-6">
            Real-time synchronization of the architectural nexus. Strategic briefings and event sequencing.
          </p>

          <div className="flex items-center justify-center gap-2 p-2 bg-[#FDFCFB] dark:bg-[#5A270F] border border-[#EEB38C]/40 dark:border-[#DF8142]/30 rounded-[1.2rem] max-w-sm mx-auto shadow-lg">
            {(["all", "news", "events"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  filter === t
                    ? "bg-[#DF8142] text-white shadow-xl"
                    : "text-[#5A270F]/50 dark:text-[#EEB38C]/40 hover:bg-[#EEB38C]/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-28 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-80 rounded-[2rem] bg-white dark:bg-[#6C3B1C] animate-pulse border border-[#EEB38C]/20" />
              ))
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item) => {
                const isRegistered = user?.id ? item.participants?.includes(user.id) : false;

                return (
                  <article key={item.id} className="group rounded-[2rem] flex flex-col sm:flex-row border shadow-lg bg-white dark:bg-[#6C3B1C] border-[#EEB38C]/40 dark:border-[#DF8142]/20 hover:border-[#DF8142] transition-all duration-300">
                    <div className="sm:w-[160px] p-6 flex flex-col items-center justify-center text-center bg-[#FAF8F4] dark:bg-[#5A270F] border-r border-[#EEB38C]/20 dark:border-[#DF8142]/10 sm:rounded-l-[2rem]">
                      {item.isEvent ? (
                        <>
                          <Calendar className="h-8 w-8 text-[#DF8142] mb-3" />
                          <p className="font-space-grotesk text-2xl font-black text-[#5A270F] dark:text-white">
                            {item.eventDate ? new Date(item.eventDate).getDate() : "--"}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/60">
                            {item.eventDate ? new Date(item.eventDate).toLocaleString("default", { month: "short" }) : "Event"}
                          </p>
                        </>
                      ) : (
                        <>
                          <Zap className="h-8 w-8 text-[#DF8142] mb-3" />
                          <p className="text-[10px] font-black uppercase text-[#92664A] dark:text-[#EEB38C]/60">Protocol Signal</p>
                        </>
                      )}
                    </div>

                    <div className="flex-1 p-6 sm:p-8 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${item.isEvent ? "bg-[#DF8142] text-white" : "bg-[#FAF8F4] dark:bg-[#5A270F] dark:text-[#EEB38C]"}`}>
                          {item.isEvent ? "Event" : "News"}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-[#92664A]">
                          <Clock className="h-3 w-3" /> {item.time}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black uppercase italic mb-3 text-[#5A270F] dark:text-white group-hover:text-[#DF8142] transition-colors">{item.title}</h2>
                      <p className="text-sm font-medium text-[#92664A] dark:text-[#EEB38C]/80 leading-relaxed mb-6">{item.content}</p>

                      <div className="mt-auto pt-5 border-t border-[#EEB38C]/40 dark:border-[#DF8142]/10 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Tag className="h-3.5 w-3.5 text-[#DF8142]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#92664A]">{item.source || "Nexus Prime"}</span>
                         </div>
                         <button 
                           title="Share Transmission"
                           className="h-10 w-10 rounded-xl bg-[#FAF8F4] dark:bg-[#5A270F] border border-[#EEB38C]/30 flex items-center justify-center hover:bg-[#DF8142] hover:text-white transition-all"
                         >
                           <Share2 className="h-4 w-4" />
                         </button>
                      </div>

                      {item.isEvent && user && (
                        <div className="mt-6 pt-6 border-t flex flex-col gap-5 border-[#EEB38C]/40 dark:border-[#DF8142]/20">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group" title="Register to Participation">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  checked={isRegistered}
                                  onChange={() => handleRegisterToggle(item.id, isRegistered)}
                                />
                                <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${isRegistered ? "bg-[#DF8142] border-[#DF8142]" : "border-[#BCAF9C] group-hover:border-[#DF8142]"}`}>
                                  {isRegistered && <CheckCircle className="h-4 w-4 text-white" />}
                                </div>
                              </div>
                              <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${isRegistered ? "text-[#DF8142]" : "text-[#5A270F] dark:text-[#EEB38C]/70"}`}>
                                {isRegistered ? "Registered for Event" : "Register Participation"}
                              </span>
                            </label>

                            {isStaff && (
                              <button
                                onClick={() => fetchParticipants(item.id)}
                                title={viewingEventId === item.id ? "Minimize Registry" : "View Participation Roster"}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                                  viewingEventId === item.id ? "bg-[#DF8142] text-white" : "bg-white dark:bg-[#5A270F] border border-[#EEB38C]/40 text-[#5A270F] dark:text-[#EEB38C] hover:border-[#DF8142]"
                                }`}
                              >
                                {viewingEventId === item.id ? "Minimize Registry" : "View Roster"}
                                <span className={`px-2 py-0.5 rounded-md text-[9px] ${viewingEventId === item.id ? "bg-white text-[#DF8142]" : "bg-[#DF8142] text-white"}`}>
                                  {item.participants?.length || 0}
                                </span>
                              </button>
                            )}
                          </div>

                          {viewingEventId === item.id && isStaff && (
                            <div className="p-6 rounded-2xl bg-[#FAF8F4] dark:bg-[#2C1105] border border-[#EEB38C]/40 dark:border-[#DF8142]/20 shadow-inner animate-in slide-in-from-top-4 fade-in duration-300">
                              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EEB38C]/30 dark:border-[#DF8142]/10">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C]">Participation Directory</h4>
                                <Users className="h-4 w-4 text-[#DF8142] animate-pulse" />
                              </div>

                              {loadingParticipants ? (
                                <div className="py-10 text-center text-[10px] font-black text-[#DF8142] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                                  <Loader2 className="h-5 w-5 animate-spin" /> Synchronizing Node...
                                </div>
                              ) : participantsData.length === 0 ? (
                                <p className="py-8 text-center text-[10px] font-bold text-[#92664A] uppercase tracking-widest">No active registrations detected.</p>
                              ) : (
                                <div className="space-y-3 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
                                  {participantsData.map((p) => (
                                    <div key={p.user.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1A0B02] border border-[#EEB38C]/40 dark:border-[#DF8142]/10 hover:border-[#DF8142]/40 transition-all shadow-sm">
                                      <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-[#FAF8F4] dark:bg-[#5A270F] flex items-center justify-center text-[#DF8142] border border-[#EEB38C]/20">
                                          <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-black text-[#5A270F] dark:text-white uppercase tracking-tight">{p.user.first_name} {p.user.last_name}</p>
                                          <p className="text-[9px] font-bold text-[#92664A] dark:text-[#EEB38C]/40 lowercase tracking-wider">{p.user.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${p.user.role?.name === "Student" ? "bg-[#DF8142] text-white" : "bg-[#5A270F] text-white"}`}>
                                          {p.user.role?.name}
                                        </span>
                                        {p.user.batch && (
                                          <span className="px-2 py-0.5 rounded bg-[#FAF8F4] dark:bg-[#2C1105] text-[#92664A] text-[8px] font-black uppercase tracking-widest border border-[#EEB38C]/30">B-{p.user.batch}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="py-40 text-center bg-white dark:bg-[#6C3B1C] rounded-[2.5rem] border border-[#EEB38C]/40">
                <Search className="h-12 w-12 text-[#DF8142]/40 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase italic">Zero Signals Found.</h3>
              </div>
            )}
          </div>

          <aside className="space-y-10">
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#2C1105] shadow-xl border border-[#EEB38C]/30">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#92664A] mb-6">Archive Scan</h3>
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan Nexus..."
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-[#FAF8F4] dark:bg-[#1A0B02] border border-[#EEB38C]/40 outline-none focus:border-[#DF8142] transition-all text-xs font-bold"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#92664A]/50" />
              </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-[#5A270F] dark:bg-[#1A0B02] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/20 blur-[60px]" />
              <h3 className="text-3xl font-black italic uppercase leading-[0.85] mb-4">Nexus <span className="text-[#DF8142] not-italic">Broadcast.</span></h3>
              <p className="text-[10px] font-bold text-[#EEB38C]/70 mb-8 uppercase tracking-widest">Connect to frequency.</p>
              
              {subscribed ? (
                <div className="p-6 rounded-2xl bg-white/10 border border-white/20 animate-in zoom-in duration-300">
                  <CheckCircle className="h-6 w-6 text-emerald-400 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Subscription Configured.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter Protocol Email"
                    className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[#DF8142] transition-colors text-xs font-bold"
                  />
                  <button type="submit" disabled={subscribing} title="Process Subscription" className="w-full h-14 rounded-2xl bg-[#DF8142] hover:bg-white hover:text-[#DF8142] transition-all text-xs font-black uppercase tracking-widest">
                    {subscribing ? "Transmitting..." : "Subscribe"}
                  </button>
                  {newsletterError && <p className="text-[9px] font-black uppercase text-rose-400">{newsletterError}</p>}
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default News;
