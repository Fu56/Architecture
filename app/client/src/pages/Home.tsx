import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Download,
  Cpu,
  Trophy,
  Calendar,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { toast } from "../lib/toast";
import { api } from "../lib/api";
import type { Resource, Blog } from "../models";
import ResourceCard from "../components/ui/ResourceCard";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  isEvent: boolean;
  eventDate: string | null;
  createdAt: string;
  time: string;
}

interface Stats {
  totalResources: number;
  totalUsers: number;
  totalDownloads: number;
  facultyCount: number;
}

const Home = () => {
  const [topResources, setTopResources] = useState<Resource[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalResources: 0,
    totalUsers: 0,
    totalDownloads: 0,
    facultyCount: 0,
  });
  const [realNews, setRealNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, , statsRes, blogRes, newsRes] = await Promise.all([
          api.get("/resources?sortBy=downloads&limit=4"),
          api.get("/resources?sortBy=recent&limit=3"),
          api.get("/common/stats"),
          api.get("/blogs?published=true&limit=2"),
          api.get("/common/news"),
        ]);

        const topData = topRes.data;
        const statsData = statsRes.data;
        const blogData = blogRes.data;
        const newsData = newsRes.data;

        if (Array.isArray(topData)) setTopResources(topData);
        else if (topData && topData.resources)
          setTopResources(topData.resources);

        if (statsData) setStats(statsData);
        if (Array.isArray(blogData)) setBlogs(blogData);
        if (Array.isArray(newsData)) setRealNews(newsData.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      toast.success("Newsletter subscription activated.");
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 bg-white">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[110vh] flex items-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#5A270F]/40 z-10" />
          <img
            src="/assets/hero.png"
            alt="Hero Architectural"
            className="w-full h-full object-cover brightness-[0.7] scale-105 animate-slow-zoom"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5A270F] via-[#6C3B1C]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(223,129,66,0.15),transparent_70%)] z-10" />
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] z-10 blueprint-grid-dark" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 w-full mt-10">
          <div className="max-w-6xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-4 px-6 py-3 mb-10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] text-white bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full animate-in fade-in slide-in-from-top-12 duration-1000 shadow-2xl group cursor-default">
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#DF8142] animate-pulse relative z-10" />
                <div className="absolute inset-0 bg-[#DF8142]/90 blur-xl opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-[#EEB38C]/40">
                ARCHVAULT: THE PRE-EMINENT ARCHIVE
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#DF8142] animate-[pulse_2s_infinite]" />
            </div>

            <h1 className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter text-white mb-8 sm:mb-12 leading-[0.75] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 uppercase italic">
              ENGINEER <br />
              <span className="relative inline-block mt-2 not-italic">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#EEB38C] to-white drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                  LEGACY.
                </span>
                <div className="absolute -bottom-4 left-0 w-full h-4 bg-[#DF8142]/40 blur-3xl -z-0" />
              </span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-12 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <div className="max-w-xl space-y-6">
                <p className="text-xl sm:text-2xl text-white/80 leading-relaxed font-black tracking-tight border-l-4 border-[#DF8142]/80 pl-10">
                  Access award-winning thesis papers, verified BIM standards,
                  and architectural artifacts curated for the vanguard.
                </p>
                <div className="flex items-center gap-6 pl-11">
                  <span className="px-3 py-1 bg-white/10 text-[10px] text-white font-black tracking-widest uppercase rounded">
                    Issue 2024.1
                  </span>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
                    Verified by 50+ Global Institutions
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-8 p-8 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-700">
                <div className="flex -space-x-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-full border-4 border-[#0a0a0b] bg-[#5A270F] overflow-hidden ring-1 ring-white/10"
                    >
                      <img
                        src={`https://i.pravatar.cc/150?u=${i + 100}`}
                        alt="Active Member"
                        className="grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full border-4 border-[#0a0a0b] bg-[#DF8142] flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-[#DF8142]/30">
                    +12K
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white leading-none tracking-tight uppercase">
                    Network Node Members
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#DF8142] animate-pulse shadow-[0_0_10px_rgba(223,129,66,0.3)]" />
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      Live Pulse ACTIVE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-20 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500"
            >
              <div className="relative max-w-4xl group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#DF8142] via-[#5A270F] to-[#DF8142] rounded-[3rem] blur-2xl opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200" />

                <div className="relative flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/20 transition-all duration-700 group-focus-within:ring-[#DF8142]/50 group-focus-within:scale-[1.01]">
                  <div className="hidden sm:block pl-10">
                    <Search className="h-7 w-7 text-gray-400 group-focus-within:text-[#DF8142] transition-all duration-500 group-focus-within:rotate-90" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter resource ID, authority, or artifact keyword..."
                    className="w-full pl-8 sm:pl-8 pr-6 py-8 sm:py-10 bg-transparent text-[#2A1205] placeholder:text-gray-500 text-lg sm:text-xl font-black focus:outline-none tracking-tight"
                  />
                  <div className="w-full sm:w-auto p-3 sm:pr-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto whitespace-nowrap px-10 sm:px-14 py-5 sm:py-7 bg-[#DF8142] hover:bg-[#5A270F] text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.8rem] transition-all duration-700 active:scale-95 shadow-2xl shadow-[#DF8142]/20 flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                    >
                      <span className="relative z-10">Initialize Search</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142]/90 to-[#5A270F] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-32 duration-1000 delay-700">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
                EXPLORE INDEX /
              </span>
              {[
                "Parametric",
                "Thesis Gold",
                "BIM Families",
                "Urban Matrix",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/browse?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white hover:text-[#2A1205] border border-white/10 rounded-full text-[12px] font-black uppercase tracking-widest text-white/70 transition-all duration-500 backdrop-blur-md hover:scale-105 active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1 backdrop-blur-md">
            <div className="w-1 h-2 bg-primary/80 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section - Strategic Precision */}
      <section className="relative z-30 py-12 -mt-32 sm:-mt-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[3.5rem] p-3 sm:p-5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white ring-1 ring-[#2A1205]/5 overflow-hidden group">
            <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 py-8 sm:py-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#DF8142]/10 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#DF8142] transition-colors duration-500">
                    <Layers className="h-8 w-8 text-white group-hover/stat:rotate-12 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F]">
                    {stats.totalResources > 999
                      ? `${(stats.totalResources / 1000).toFixed(1)}k+`
                      : stats.totalResources}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                      MASTER RESOURCES
                    </p>
                    <span className="text-[10px] font-bold text-[#DF8142] uppercase tracking-widest mt-1 italic">
                      Verified Library
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#92664A]/5 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#6C3B1C] transition-colors duration-500">
                    <Users className="h-8 w-8 text-white group-hover/stat:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F]">
                    {stats.totalUsers > 999
                      ? `${(stats.totalUsers / 1000).toFixed(1)}k+`
                      : stats.totalUsers}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                      GLOBAL VISIONARIES
                    </p>
                    <span className="text-[10px] font-bold text-[#6C3B1C] uppercase tracking-widest mt-1 italic">
                      Growing Community
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#DF8142]/10 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#DF8142] transition-colors duration-500">
                    <Download className="h-8 w-8 text-white group-hover/stat:translate-y-1 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F]">
                    {stats.totalDownloads > 999
                      ? `${(stats.totalDownloads / 1000).toFixed(1)}k+`
                      : stats.totalDownloads}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                      STUDIO DEPLOYMENTS
                    </p>
                    <span className="text-[10px] font-bold text-[#DF8142] uppercase tracking-widest mt-1 italic">
                      Asset Utilization
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center space-y-6 lg:px-8 pt-12 lg:pt-0 group/stat">
                <div className="relative">
                  <div className="absolute -inset-6 bg-[#92664A]/5 rounded-full scale-0 group-hover/stat:scale-100 opacity-0 group-hover/stat:opacity-100 transition-all duration-700 -z-0" />
                  <div className="relative p-6 bg-[#5A270F] rounded-2xl shadow-2xl group-hover/stat:bg-[#92664A] transition-colors duration-500">
                    <Cpu className="h-8 w-8 text-white group-hover/stat:rotate-[-15deg] transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black tracking-tighter text-[#5A270F]">
                    {stats.facultyCount}+
                  </p>
                  <div className="flex flex-col">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                      VERIFIED FACULTY
                    </p>
                    <span className="text-[10px] font-bold text-[#92664A] uppercase tracking-widest mt-1 italic">
                      Expert Guidance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Indicator Bar */}
            <div className="flex items-center justify-center gap-6 py-4 bg-[#EFEDED]/50 rounded-b-[2.5rem] border-t border-[#D9D9C2] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent translate-x-[-100%] animate-shimmer" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DF8142] animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(223,129,66,0.3)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F]">
                  REAL-TIME NETWORK INDEX
                </span>
              </div>
              <span className="text-[#EEB38C] relative z-10">|</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.4em] relative z-10">
                LAST CLOUD SYNC:{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Platform Sections - Architectural Ecosystem */}
      <section className="py-48 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-32">
            <div className="inline-block p-1 mb-8 rounded-full bg-[#DF8142]/10 border border-[#DF8142]/20">
              <span className="px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-[#DF8142] block">
                CORE ECOSYSTEM
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#5A270F] uppercase leading-[0.8]">
              THE ARCHITECTURAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#5A270F] italic">
                STANDARD.
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {/* Elite Projects */}
            <div className="group relative bg-[#fafafa] p-12 rounded-[4rem] border border-[#D9D9C2] transition-all duration-700 hover:bg-white hover:shadow-[0_48px_100px_-24px_rgba(79,70,229,0.12)] hover:-translate-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-150">
                <Trophy className="h-48 w-48" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-[#DF8142] text-white rounded-[1.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-[#DF8142]/20 group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-[#5A270F] mb-6 uppercase leading-none">
                  ELITE <br />
                  PROJECTS
                </h3>
                <p className="text-[#5A270F] leading-relaxed font-bold mb-12 text-lg">
                  Access award-winning thesis papers and research from the
                  world's leading architectural minds.
                </p>
                <div className="flex flex-col gap-5 mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#DF8142]/90 shadow-[0_0_8px_rgba(223,129,66,0.3)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#92664A]">
                      Peer-Reviewed Standard
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#DF8142]/90 shadow-[0_0_8px_rgba(223,129,66,0.3)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#92664A]">
                      Thesis Gold Benchmarks
                    </span>
                  </div>
                </div>
                <Link
                  to="/browse?sort=top"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#DF8142] hover:gap-6 transition-all duration-500 group/link"
                >
                  VIEW FULL ARCHIVE{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Course Assignments */}
            <div className="group relative bg-[#fafafa] p-12 rounded-[4rem] border border-[#D9D9C2] transition-all duration-700 hover:bg-white hover:shadow-[0_48px_100px_-24px_rgba(168,85,247,0.12)] hover:-translate-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-150">
                <Briefcase className="h-48 w-48" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-[#6C3B1C] text-white rounded-[1.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-[#6C3B1C]/30 group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-[#5A270F] mb-6 uppercase leading-none">
                  FACULTY <br />
                  BENCHMARKS
                </h3>
                <p className="text-[#5A270F] leading-relaxed font-bold mb-12 text-lg">
                  Access structured coursework and verified professional
                  reference materials from senior faculty.
                </p>
                <div className="flex flex-col gap-5 mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#92664A] shadow-[0_0_8px_rgba(146,102,74,0.3)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                      Syllabus Alignment
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#92664A] shadow-[0_0_8px_rgba(146,102,74,0.3)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                      Studio Directives
                    </span>
                  </div>
                </div>
                <Link
                  to="/dashboard/assignments"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F] hover:gap-6 transition-all duration-500 group/link"
                >
                  DIRECT ACCESS{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Verified Platform */}
            <div className="group relative bg-[#5A270F] p-12 rounded-[4rem] transition-all duration-700 hover:shadow-[0_48px_100px_-24px_rgba(0,0,0,0.4)] hover:-translate-y-4 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(223,129,66,0.2),transparent_60%)]" />
              <div className="absolute inset-0 blueprint-grid-dark opacity-10" />

              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl text-white rounded-[1.5rem] flex items-center justify-center mb-12 border border-white/20 group-hover:bg-[#DF8142] group-hover:border-[#DF8142]/90 transition-all duration-500">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-white mb-6 uppercase leading-none">
                  VERIFIED <br />
                  TRUST
                </h3>
                <p className="text-gray-500 leading-relaxed font-bold mb-12 text-lg">
                  A high-security ecosystem ensuring intellectual property
                  protection and content authenticity.
                </p>
                <div className="flex flex-col gap-5 mb-14">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#DF8142]/90 shadow-[0_0_12px_rgba(223,129,66,0.6)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#EEB38C]/80">
                      IP Protection Protocol
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#DF8142]/90 shadow-[0_0_12px_rgba(223,129,66,0.6)]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#EEB38C]/80">
                      Zero-Trust Encryption
                    </span>
                  </div>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:text-[#DF8142]/80 hover:gap-6 transition-all duration-500 group/link"
                >
                  LEARN MORE{" "}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Resources - Curated Gallery */}
      <section className="py-48 bg-[#EFEDED] relative overflow-hidden">
        {/* Decorative architectural lines */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white -skew-x-12 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[2px] bg-[#DF8142]" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#DF8142]">
                  GLOBAL CURATION INDEX
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#5A270F] leading-[0.8] uppercase">
                SPOTLIGHT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] via-[#6C3B1C] to-[#DF8142]/90 italic">
                  RESOURCES.
                </span>
              </h2>
              <p className="text-[#6C3B1C] mt-10 text-xl font-bold max-w-2xl leading-relaxed">
                The most downloaded and peer-reviewed architectural artifacts
                across the global network this week.
              </p>
            </div>

            <Link
              to="/browse"
              className="group relative flex items-center gap-6 px-12 py-7 bg-[#5A270F] hover:bg-[#DF8142] text-white rounded-[2rem] transition-all duration-700 shadow-2xl active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em]">
                Explore Gallery
              </span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>

          {topResources.length > 0 ? (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              {topResources.map((resource) => (
                <div
                  key={resource.id}
                  className="animate-in fade-in slide-in-from-bottom-12 duration-1000"
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 bg-white/50 backdrop-blur-3xl rounded-[4rem] border border-dashed border-[#D9D9C2] flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-8 animate-pulse">
                <Layers className="h-12 w-12 text-[#EEB38C]" />
              </div>
              <h3 className="text-2xl font-black text-[#2A1205] mb-3 uppercase tracking-tight leading-none">
                SYNCHRONIZING DATA
              </h3>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                Fetching latest architectural benchmarks from the CDN...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Insights & Professional Journal */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-32">
            {/* Blogs - Research Wing */}
            <div className="lg:w-2/3">
              <div className="mb-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-[2px] bg-[#5A270F]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#5A270F]">
                    RESEARCH & PERSPECTIVES
                  </span>
                </div>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-[#5A270F] leading-[0.75] uppercase italic">
                  FACULTY <br />
                  <span className="text-[#DF8142] not-italic">INSIGHTS.</span>
                </h2>
              </div>

              <div className="grid gap-20 sm:grid-cols-2">
                {blogs.map((blog) => (
                  <article key={blog.id} className="group cursor-pointer">
                    <Link to={`/blog/${blog.id}`} className="block">
                      <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-12 shadow-[0_40px_80px_-20px_rgba(90,39,15,0.15)] group-hover:shadow-[#DF8142]/20 transition-all duration-1000">
                        <img
                          src={
                            blog.image_path
                              ? `${import.meta.env.VITE_API_URL}/${
                                  blog.image_path
                                }`
                              : "/assets/blog-placeholder.png"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] grayscale group-hover:grayscale-0"
                          alt={blog.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1205] via-[#2A1205]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                        <div className="absolute top-10 left-10">
                          <div className="px-5 py-2 glass-morphism rounded-full border border-white/20">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
                              Issue 2024
                            </span>
                          </div>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <div className="w-full py-5 bg-white text-[#5A270F] rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-center shadow-2xl">
                            Read Full Publication
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="space-y-6 px-4">
                      <div className="flex gap-3">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-[#DF8142] bg-[#DF8142]/10 px-5 py-2 rounded-full border border-[#DF8142]/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-black tracking-tight text-[#5A270F] group-hover:text-[#DF8142] transition-colors leading-[1.1] uppercase">
                        {blog.title}
                      </h3>
                      <p className="text-[#6C3B1C] line-clamp-2 text-lg font-bold leading-relaxed opacity-80">
                        {blog.content.slice(0, 150)}...
                      </p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#5A270F] hover:text-[#DF8142] border-b-2 border-[#D9D9C2] hover:border-[#DF8142] pb-2 transition-all"
                      >
                        EXPLORE STORY <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* News Sidebar - High End Professional Journal */}
            <div className="lg:w-1/3 pt-12">
              <div className="bg-[#2A1205] p-12 sm:p-16 rounded-[4.5rem] text-white space-y-20 shadow-[0_64px_128px_-32px_rgba(42,18,5,0.5)] relative overflow-hidden group/journal">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DF8142]/10 blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover/journal:bg-[#DF8142]/20 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F]" />

                <div className="relative z-10 flex items-center justify-between pb-10 border-b border-white/10">
                  <div>
                    <h3 className="text-4xl font-black uppercase tracking-[-0.05em] mb-2 italic">
                      Journal
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#DF8142] animate-pulse" />
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">
                        Live Updates
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/5 rounded-[1.2rem] border border-white/10 flex items-center justify-center hover:bg-[#DF8142] hover:border-[#DF8142]/90 transition-all duration-500">
                    <Calendar className="h-7 w-7 text-[#DF8142]/80 group-hover/journal:text-white" />
                  </div>
                </div>

                <div className="relative z-10 space-y-16 py-4">
                  {realNews.length > 0 ? (
                    realNews.map((item) => (
                      <div
                        key={item.id}
                        className="group/news cursor-pointer space-y-5"
                      >
                        <div className="flex items-center gap-5 text-[9px] font-black uppercase tracking-[0.3em]">
                          <span
                            className={`${
                              item.isEvent
                                ? "text-[#DF8142] border border-[#DF8142]/30 bg-[#DF8142]/10"
                                : "text-[#EEB38C] border border-[#EEB38C]/30 bg-[#EEB38C]/10"
                            } px-4 py-1 rounded-full`}
                          >
                            {item.isEvent ? "EVENT" : "LIVE"}
                          </span>
                          <span className="text-white/30 truncate max-w-[120px]">
                            {item.source || "ARCHVAULT"}
                          </span>
                          <span className="text-white/10">/</span>
                          <span className="text-white/30">{item.time}</span>
                        </div>
                        <h4 className="text-2xl font-black group-hover/news:text-[#EEB38C] transition-colors leading-[1.2] tracking-tight uppercase">
                          {item.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-white/5">
                        <Cpu className="h-6 w-6 text-[#EEB38C]/20" />
                      </div>
                      <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">
                        Awaiting Sync
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Refined Architectural Terminal */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#5A270F] z-0" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#DF8142]/10 skew-x-12 translate-x-1/4 z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-12 sm:p-20 border border-white/10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-white">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#DF8142]/20 border border-[#DF8142]/30 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-[#DF8142] mb-8">
                <Sparkles className="h-3.5 w-3.5" /> THE ARCHITECT'S DIGEST
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
                UNBOX <br />
                <span className="text-[#DF8142] italic">INNOVATION.</span>
              </h2>
              <p className="text-lg text-white/50 font-medium tracking-tight leading-relaxed max-w-md italic border-l-2 border-[#DF8142]/40 pl-8">
                Curated digests of top-tier architectural thesis, BIM families,
                and technical benchmarks.
              </p>
            </div>

            <div className="lg:w-1/2 w-full">
              {subscribed ? (
                <div className="bg-[#DF8142] text-white p-12 rounded-[3.5rem] text-center font-black animate-in zoom-in-95 duration-700 shadow-2xl flex flex-col items-center gap-6">
                  <ShieldCheck className="h-12 w-12" />
                  <span className="text-xl sm:text-3xl uppercase tracking-tighter leading-none">
                    ACCESS REGISTERED
                  </span>
                  <p className="text-[10px] text-white/80 font-black uppercase tracking-[0.4em]">
                    Welcome to the Nexus.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="relative group flex flex-col sm:block">
                    <div className="absolute -inset-2 bg-[#DF8142] rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-20 transition-all duration-1000" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER STUDIO EMAIL..."
                      required
                      className="relative w-full h-20 sm:h-24 bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] pl-10 sm:pl-12 pr-10 sm:pr-44 text-base sm:text-lg font-bold text-white placeholder:text-white/20 outline-none focus:ring-4 focus:ring-[#DF8142]/10 transition-all duration-700 shadow-2xl tracking-widest"
                    />
                    <button
                      type="submit"
                      className="mt-4 sm:mt-0 relative sm:absolute sm:right-3 sm:top-3 sm:bottom-3 px-10 sm:px-12 py-4 sm:py-0 bg-[#DF8142] hover:bg-white hover:text-[#5A270F] text-white font-black uppercase tracking-[0.3em] rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-700 shadow-2xl active:scale-95"
                    >
                      REGISTER
                    </button>
                  </div>
                  <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] text-center px-12 italic">
                    ENCRYPTED TRANSMISSION • ZERO SPAM PROTOCOL • BIM COMPLIANT
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interdisciplinary Collaboration - The Human Element */}
      <section className="py-48 bg-[#EFEDED] relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DF8142]/20 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            {/* Visual Narrative */}
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-6 bg-[#DF8142]/10 rounded-[4rem] blur-3xl scale-95 group-hover:scale-100 transition-transform duration-1000" />
              <div className="relative rounded-[3.5rem] overflow-hidden border border-[#D9D9C2] shadow-2xl transition-all duration-700 hover:shadow-[#DF8142]/20 group-hover:-translate-y-2">
                <img
                  src="/assets/collaborators.png"
                  className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-[2s] scale-100 group-hover:scale-110"
                  alt="Architecture and Software Engineering Collaboration"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5A270F] via-[#5A270F]/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000" />

                {/* Floating Badge */}
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="glass-morphism p-8 rounded-[2rem] border border-white/20 backdrop-blur-3xl animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex -space-x-3">
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-[#DF8142] flex items-center justify-center text-[10px] font-black text-white">
                          ARCH
                        </div>
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-[#5A270F] flex items-center justify-center text-[10px] font-black text-white">
                          SOFT
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                        JOINT VENTURE
                      </span>
                    </div>
                    <p className="text-white/80 text-xs font-bold leading-relaxed">
                      Bridge of intelligence between physical space and digital
                      logic.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Geometric Elements */}
              <div className="absolute -top-12 -right-12 h-48 w-48 border border-[#DF8142]/20 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 border-2 border-[#5A270F]/10 rounded-[2rem] rotate-12" />
            </div>

            {/* Strategic Information */}
            <div className="lg:w-1/2 space-y-12">
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#DF8142] mb-8">
                  <Sparkles className="h-4 w-4" /> THE COLLABORATION
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#5A270F] uppercase leading-[0.8] mb-10">
                  FUSION OF <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF8142] to-[#6C3B1C] italic">
                    DISCIPLINES.
                  </span>
                </h2>
                <p className="text-xl text-[#6C3B1C] font-bold leading-relaxed max-w-xl">
                  ARCHVAULT is the product of a high-performance synergy between
                  the **Department of Architecture** and the **Software
                  Engineering Department**.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-10 bg-white rounded-[2.5rem] border border-[#D9D9C2] shadow-sm hover:border-[#DF8142]/40 transition-all duration-500 hover:-translate-y-1">
                  <div className="h-12 w-12 bg-[#DF8142]/10 rounded-2xl flex items-center justify-center text-[#DF8142] mb-6">
                    <Users className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-black text-[#5A270F] uppercase tracking-tight mb-4">
                    ARCH_CORE
                  </h4>
                  <p className="text-gray-500 text-sm font-bold leading-relaxed">
                    Architecture students defined the library taxonomy, BIM
                    standards, and creative vision.
                  </p>
                </div>

                <div className="p-10 bg-white rounded-[2.5rem] border border-[#D9D9C2] shadow-sm hover:border-[#5A270F]/40 transition-all duration-500 hover:-translate-y-1">
                  <div className="h-12 w-12 bg-[#5A270F]/10 rounded-2xl flex items-center justify-center text-[#5A270F] mb-6">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-black text-[#5A270F] uppercase tracking-tight mb-4">
                    SOFT_LOGIC
                  </h4>
                  <p className="text-gray-500 text-sm font-bold leading-relaxed">
                    Software engineering students engineered the high-speed CDN,
                    encryption layer, and UX matrix.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-[#D9D9C2]">
                <div className="flex items-center gap-12">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">
                      PROJECT SCALE
                    </p>
                    <p className="text-3xl font-black text-[#5A270F] tracking-tighter uppercase">
                      INTER-DEPT
                    </p>
                  </div>
                  <div className="h-12 w-px bg-[#D9D9C2]" />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">
                      SYNERGY NODE
                    </p>
                    <p className="text-3xl font-black text-[#DF8142] tracking-tighter uppercase">
                      ACTIVE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
